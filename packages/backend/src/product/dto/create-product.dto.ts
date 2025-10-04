import {
	IsString,
	IsNotEmpty,
	IsNumber,
	Min,
	IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Type(() => Number)
	price: number;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsNumber()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	inStock?: number;
}
