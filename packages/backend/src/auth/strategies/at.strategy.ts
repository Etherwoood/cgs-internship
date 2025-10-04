import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RevokedTokensService } from '../revoke-tokens.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private revokedTokensService: RevokedTokensService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || 'dev_secret',
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload) {
		const authHeader = req.headers['authorization'] as string | undefined;
		const token = authHeader?.startsWith('Bearer ')
			? authHeader.split(' ')[1]
			: undefined;
		if (token && this.revokedTokensService.isRevoked(token)) {
			throw new UnauthorizedException('Token has been revoked');
		}
		return payload;
	}
}
