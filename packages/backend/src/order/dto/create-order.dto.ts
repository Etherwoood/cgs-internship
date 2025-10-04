import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, DeliveryStatus } from '@prisma/client';

export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsEnum(PaymentStatus)
	@IsOptional()
	paymentStatus?: PaymentStatus = PaymentStatus.PENDING;

	@IsEnum(DeliveryStatus)
	@IsOptional()
	deliveryStatus?: DeliveryStatus = DeliveryStatus.PENDING;
}
