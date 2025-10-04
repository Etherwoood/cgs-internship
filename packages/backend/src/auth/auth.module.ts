import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { EmailModule } from '@/email/email.module';
import { AtStrategy } from './strategies/at.strategy';
import { RevokedTokensService } from './revoke-tokens.service';
import { AtGuard } from './guards/at.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
	imports: [PrismaModule, UserModule, EmailModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		AtStrategy,
		RevokedTokensService,
		AtGuard,
		RolesGuard,
	],
	exports: [AuthService, RevokedTokensService, AtGuard, RolesGuard],
})
export class AuthModule {}
