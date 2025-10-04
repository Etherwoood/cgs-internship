import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
	constructor(
		private reflector: Reflector,
		private prisma: PrismaService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (isPublic) {
			return true;
		}

		const canActivate = await super.canActivate(context);
		if (!canActivate) {
			return false;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (user) {
			const dbUser = await this.prisma.user.findUnique({
				where: { id: user.sub },
			});

			if (dbUser && !dbUser.isVerified && dbUser.role !== 'ADMIN') {
				throw new UnauthorizedException('Email not verified');
			}
		}

		return true;
	}
}
