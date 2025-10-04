import { HttpService } from './http.service';
import { HttpFactoryService } from './http-factory.service';
import type {
	RegisterRequest,
	LoginRequest,
	VerifyEmailRequest,
	ResendCodeRequest,
	AuthResponse,
	UserResponse,
	IResponseMessage,
} from '../types/auth.types';

export class AuthService {
	private readonly module = 'auth';

	constructor(private readonly httpService: HttpService) {
		this.httpService = httpService;
	}

	public async register(body: RegisterRequest): Promise<IResponseMessage> {
		return this.httpService.post(`${this.module}/register`, body);
	}

	public async verifyEmail(body: VerifyEmailRequest): Promise<AuthResponse> {
		return this.httpService.post(`${this.module}/verify`, body);
	}

	public async login(body: LoginRequest): Promise<AuthResponse> {
		return this.httpService.post(`${this.module}/login`, body);
	}

	public async logout(): Promise<IResponseMessage> {
		return this.httpService.post(`${this.module}/logout`, {});
	}

	public async resendCode(
		body: ResendCodeRequest,
	): Promise<IResponseMessage> {
		return this.httpService.post(`${this.module}/resend`, body);
	}

	public async getCurrentUser(): Promise<UserResponse> {
		return this.httpService.get(`${this.module}/me`);
	}
}

export const authService = new AuthService(
	new HttpFactoryService().createHttpService(),
);
