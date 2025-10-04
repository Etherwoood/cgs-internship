import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AtGuard } from './guards/at.guard';
import { CurrentUser, JwtPayload } from './decorators/current-user.decorator';
import { RevokedTokensService } from './revoke-tokens.service';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly revokedTokensService: RevokedTokensService,
	) {}

	@Post('register')
	async register(@Body() dto: RegisterDto): Promise<void> {
		await this.authService.register(dto);
	}

	@Post('verify')
	@HttpCode(HttpStatus.OK)
	async verify(@Body() dto: VerifyEmailDto): Promise<AuthResponseDto> {
		return this.authService.verifyEmail(dto);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
		return this.authService.login(dto);
	}

	@Post('logout')
	@UseGuards(AtGuard)
	@HttpCode(HttpStatus.OK)
	logout(@Request() req: ExpressRequest) {
		const token = req.headers.authorization?.split(' ')[1];
		if (token) this.revokedTokensService.revoke(token);
		return { message: 'Logged out successfully' };
	}

	@Get('me')
	@UseGuards(AtGuard)
	@HttpCode(HttpStatus.OK)
	async me(@CurrentUser() user: JwtPayload) {
		return user;
	}
}
