import { Injectable } from '@nestjs/common';

@Injectable()
export class RevokedTokensService {
	private revokedTokens = new Set<string>();

	revoke(token: string) {
		this.revokedTokens.add(token);
	}

	isRevoked(token: string): boolean {
		return this.revokedTokens.has(token);
	}
}
