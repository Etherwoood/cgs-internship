import { UserResponseDto } from '@/user/dto/user-responce.dto';

export class AuthResponseDto {
	accessToken: string;
	user: UserResponseDto;
}
