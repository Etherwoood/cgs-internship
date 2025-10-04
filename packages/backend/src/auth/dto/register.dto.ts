import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
		message:
			'Password must contain lowercase, uppercase, number and special character',
	})
	password: string;

	@IsString()
	@MinLength(3)
	fullName: string;

	@IsString()
	@Matches(/^\+?\d{10,15}$/, {
		message: 'Phone number must contain 10–15 digits and may start with +',
	})
	phoneNumber: string;

	@IsString()
	@MinLength(10)
	shippingAddress: string;

	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;
}
