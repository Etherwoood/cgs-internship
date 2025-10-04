import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class IsExistMiddleware implements NestMiddleware {
	constructor(private readonly prisma: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const path = req.path || req.url;
		const model = path.split('/')[1];

		if (!id || !model) {
			return next();
		}
		const modelMap: Record<
			string,
			{
				findUnique: (args: {
					where: { id: string };
				}) => Promise<unknown>;
			}
		> = {
			products: this.prisma.product,
			users: this.prisma.user,
		};

		const prismaModel = modelMap[model];
		if (!prismaModel) {
			return next();
		}

		try {
			const entity = await prismaModel.findUnique({
				where: { id },
			});

			if (!entity) {
				throw new NotFoundException(`Resource with id ${id} not found`);
			}

			(req as Request & { entity: unknown }).entity = entity;
			next();
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			next();
		}
	}
}
