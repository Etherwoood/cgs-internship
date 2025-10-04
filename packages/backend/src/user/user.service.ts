import { PrismaService } from '@/prisma/prisma.service';
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-responce.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createUserDto: CreateUserDto & { verificationToken?: string | null },
	): Promise<UserResponseDto> {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: createUserDto.email,
				password: hashedPassword,
				fullName: createUserDto.fullName,
				phoneNumber: createUserDto.phoneNumber,
				shippingAddress: createUserDto.shippingAddress,
				role: createUserDto.role || UserRole.USER,
				verificationToken: createUserDto.verificationToken,
			},
		});

		return new UserResponseDto(user);
	}

	async findAll(): Promise<UserResponseDto[]> {
		const users = await this.prisma.user.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return users.map((user) => new UserResponseDto(user));
	}

	async findOne(id: string): Promise<UserResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return new UserResponseDto(user);
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async update(
		id: string,
		updateData: Partial<CreateUserDto>,
	): Promise<UserResponseDto> {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (updateData.password) {
			updateData.password = await bcrypt.hash(updateData.password, 10);
		}

		const updatedUser = await this.prisma.user.update({
			where: { id },
			data: updateData,
		});

		return new UserResponseDto(updatedUser);
	}

	async remove(id: string): Promise<void> {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.prisma.user.delete({ where: { id } });
	}

	async verifyEmail(verificationToken: string): Promise<UserResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { verificationToken },
		});

		if (!user) {
			throw new NotFoundException('Invalid verification token');
		}

		const verifiedUser = await this.prisma.user.update({
			where: { id: user.id },
			data: {
				isVerified: true,
				verificationToken: null,
			},
		});

		return new UserResponseDto(verifiedUser);
	}
}
