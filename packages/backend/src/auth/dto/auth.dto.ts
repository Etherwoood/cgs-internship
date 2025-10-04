import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@IsEmail({}, { message: 'Email must be valid' })
	email: string;

	@IsString({ message: 'Password must be a string' })
	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	password: string;

	@IsString({ message: 'Full name must be a string' })
	fullName: string;

	@IsString({ message: 'Phone number must be a string' })
	phoneNumber: string;

	@IsString({ message: 'Shipping address must be a string' })
	shippingAddress: string;
}

export class LoginDto {
	@IsEmail({}, { message: 'Email must be valid' })
	email: string;

	@IsString({ message: 'Password must be a string' })
	password: string;
}

export class VerifyEmailDto {
	@IsEmail({}, { message: 'Email must be valid' })
	email: string;

	@IsString({ message: 'Code must be a string' })
	@MinLength(4, { message: 'Code must contain 4 characters' })
	code: string;
}

export class ResendCodeDto {
	@IsEmail({}, { message: 'Email must be valid' })
	email: string;
}
