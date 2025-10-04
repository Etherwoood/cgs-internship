import type { User, UserRole } from '@prisma/client';

export class UserResponseDto {
	id: string;
	email: string;
	fullName: string;
	phoneNumber: string;
	shippingAddress: string;
	role: UserRole;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;

	constructor(user: User) {
		this.id = user.id;
		this.email = user.email;
		this.fullName = user.fullName;
		this.phoneNumber = user.phoneNumber;
		this.shippingAddress = user.shippingAddress;
		this.role = user.role;
		this.isVerified = user.isVerified;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
	}
}
