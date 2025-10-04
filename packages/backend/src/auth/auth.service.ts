import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/email/email.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '@/user/dto/user-responce.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from '@/user/user.service';

function generateCode(): string {
	const value = Math.floor(1000 + Math.random() * 9000);
	return String(value);
}

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly users: UserService,
		private readonly emailService: EmailService,
	) {}

	async register(dto: RegisterDto): Promise<void> {
		const exists = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (exists) throw new ConflictException('User already exists');

		const code = generateCode();

		await this.users.create({
			email: dto.email,
			password: dto.password,
			fullName: dto.fullName,
			phoneNumber: dto.phoneNumber,
			shippingAddress: dto.shippingAddress,
			role: dto.role,
			verificationToken: code,
		});

		await this.emailService.sendVerificationCode(dto.email, code);
	}

	async verifyEmail(dto: VerifyEmailDto): Promise<AuthResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (!user || user.verificationToken !== dto.code) {
			throw new UnauthorizedException('Invalid code');
		}

		const updated = await this.prisma.user.update({
			where: { id: user.id },
			data: { isVerified: true, verificationToken: null },
		});

		const token = this.signAccessToken(
			updated.id,
			updated.email,
			updated.role,
		);
		return { accessToken: token, user: new UserResponseDto(updated) };
	}

	async login(dto: LoginDto): Promise<AuthResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (!user) throw new UnauthorizedException('Invalid credentials');

		if (!user.isVerified && user.role !== 'ADMIN')
			throw new UnauthorizedException('Email not verified');

		const ok = await bcrypt.compare(dto.password, user.password);
		if (!ok) throw new UnauthorizedException('Invalid credentials');

		const token = this.signAccessToken(user.id, user.email, user.role);
		return { accessToken: token, user: new UserResponseDto(user) };
	}

	private signAccessToken(sub: string, email: string, role: string): string {
		const secret = process.env.JWT_SECRET || 'dev_secret';
		return jwt.sign({ sub, email, role }, secret, { expiresIn: '1h' });
	}
}
