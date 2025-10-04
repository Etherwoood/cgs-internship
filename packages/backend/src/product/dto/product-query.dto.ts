import {
	IsOptional,
	IsString,
	IsEnum,
	IsNumber,
	Min,
	Max,
	IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export enum SortBy {
	PRICE = 'price',
	NAME = 'name',
	IN_STOCK = 'inStock',
	CREATED_AT = 'createdAt',
}

export class ProductQueryDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	category?: string;

	@IsNumber()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	minStock?: number;

	@IsBoolean()
	@IsOptional()
	@Type(() => Boolean)
	inStockOnly?: boolean;

	@IsEnum(SortBy)
	@IsOptional()
	sortBy?: SortBy = SortBy.CREATED_AT;

	@IsEnum(SortOrder)
	@IsOptional()
	order?: SortOrder = SortOrder.DESC;

	@IsNumber()
	@Min(1)
	@Type(() => Number)
	@IsOptional()
	page?: number = 1;

	@IsNumber()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	@IsOptional()
	limit?: number = 10;
}
