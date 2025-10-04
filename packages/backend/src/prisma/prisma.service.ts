import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	async onApplicationShutdown(): Promise<void> {
		await this.$disconnect();
	}
}
