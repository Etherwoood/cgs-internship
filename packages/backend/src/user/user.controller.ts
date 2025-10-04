import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-responce.dto';
import { AtGuard } from '../auth/guards/at.guard';

@Controller('users')
@UseGuards(AtGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(
		@Body() createUserDto: CreateUserDto,
	): Promise<UserResponseDto> {
		return this.userService.create(createUserDto);
	}

	@Get()
	async findAll(): Promise<UserResponseDto[]> {
		return this.userService.findAll();
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<UserResponseDto> {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: Partial<CreateUserDto>,
	): Promise<UserResponseDto> {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.userService.remove(id);
	}

	@Post('verify-email/:token')
	async verifyEmail(@Param('token') token: string): Promise<UserResponseDto> {
		return this.userService.verifyEmail(token);
	}
}
