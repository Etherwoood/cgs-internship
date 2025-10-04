export interface RegisterRequest {
	email: string;
	password: string;
	fullName: string;
	phoneNumber: string;
	shippingAddress: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface VerifyEmailRequest {
	email: string;
	code: string;
}

export interface ResendCodeRequest {
	email: string;
}

export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export interface UserResponse {
	id: string;
	email: string;
	fullName: string;
	phoneNumber: string;
	shippingAddress: string;
	role: UserRole;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	accessToken: string;
	user: UserResponse;
}

export interface IResponseMessage {
	message: string;
}

export interface IServerError {
	message: string;
	statusCode: number;
	error?: string;
}
