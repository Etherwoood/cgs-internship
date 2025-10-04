import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDetailDto {
	@IsString()
	@IsNotEmpty()
	orderId: string;

	@IsString()
	@IsNotEmpty()
	productId: string;

	@IsNumber()
	@Min(1)
	@Type(() => Number)
	quantity: number;
}
