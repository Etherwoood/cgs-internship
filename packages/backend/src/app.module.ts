import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order-detail/order-detail.module';

@Module({
	imports: [
		PrismaModule,
		EmailModule,
		UserModule,
		AuthModule,
		ProductModule,
		OrderModule,
		OrderDetailModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
