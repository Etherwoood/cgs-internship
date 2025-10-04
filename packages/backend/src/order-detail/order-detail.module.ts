import { Module } from '@nestjs/common';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [OrderDetailController],
	providers: [OrderDetailService],
	exports: [OrderDetailService],
})
export class OrderDetailModule {}
