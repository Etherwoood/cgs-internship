import { z } from 'zod';

// Password validation helper
const passwordValidation = z
	.string()
	.min(6, 'Password must be at least 6 characters')
	.refine((val) => /[a-z]/.test(val), {
		message: 'Password must contain at least one lowercase letter',
	})
	.refine((val) => /[A-Z]/.test(val), {
		message: 'Password must contain at least one uppercase letter',
	})
	.refine((val) => /\d/.test(val), {
		message: 'Password must contain at least one number',
	})
	.refine((val) => /[!@#$%^&*]/.test(val), {
		message: 'Password must contain at least one special character',
	});

export const registerSchema = z
	.object({
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Invalid email format'),
		password: passwordValidation,
		fullName: z
			.string()
			.min(1, 'Full name is required')
			.min(3, 'Full name must be at least 3 characters'),
		phoneNumber: z
			.string()
			.min(1, 'Phone number is required')
			.regex(
				/^\+?\d{10,15}$/,
				'Phone number must contain 10–15 digits and may start with +',
			),
		shippingAddress: z
			.string()
			.min(1, 'Shipping address is required')
			.min(10, 'Shipping address must be at least 10 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const loginSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	code: z
		.string()
		.min(1, 'Verification code is required')
		.min(4, 'Code must contain 4 digits')
		.max(4, 'Code must contain 4 digits')
		.regex(/^\d{4}$/, 'Code must contain only digits'),
});

export const resendCodeSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendCodeFormData = z.infer<typeof resendCodeSchema>;
