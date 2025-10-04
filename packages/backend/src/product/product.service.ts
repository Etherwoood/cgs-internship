import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto, SortBy, SortOrder } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createProductDto: CreateProductDto,
	): Promise<ProductResponseDto> {
		const product = await this.prisma.product.create({
			data: createProductDto,
		});

		return new ProductResponseDto(product);
	}

	async findAll(query: ProductQueryDto): Promise<{
		products: ProductResponseDto[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const {
			name,
			category,
			minStock,
			inStockOnly,
			sortBy = SortBy.CREATED_AT,
			order = SortOrder.DESC,
			page = 1,
			limit = 5,
		} = query;
		const skip = (page - 1) * limit;

		const where: {
			name?: { contains: string; mode: 'insensitive' };
			category?: { contains: string; mode: 'insensitive' };
			inStock?: { gte?: number; gt?: number };
		} = {};

		if (name) {
			where.name = {
				contains: name,
				mode: 'insensitive' as const,
			};
		}

		if (category) {
			where.category = {
				contains: category,
				mode: 'insensitive' as const,
			};
		}

		if (minStock !== undefined) {
			where.inStock = {
				gte: minStock,
			};
		}

		if (inStockOnly) {
			where.inStock = {
				gt: 0,
			};
		}

		const orderBy = this.getOrderBy(sortBy, order);
		const [products, total] = await Promise.all([
			this.prisma.product.findMany({
				where,
				orderBy,
				skip,
				take: limit,
			}),
			this.prisma.product.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			products: products.map(
				(product) => new ProductResponseDto(product),
			),
			total,
			page,
			limit,
			totalPages,
		};
	}

	async findOne(id: string): Promise<ProductResponseDto> {
		const product = await this.prisma.product.findUnique({
			where: { id },
		});

		return new ProductResponseDto(product!);
	}

	async update(
		id: string,
		updateProductDto: UpdateProductDto,
	): Promise<ProductResponseDto> {
		const product = await this.prisma.product.update({
			where: { id },
			data: updateProductDto,
		});

		return new ProductResponseDto(product);
	}

	async remove(id: string): Promise<void> {
		await this.prisma.product.delete({
			where: { id },
		});
	}

	private getOrderBy(sortBy: SortBy, order: SortOrder) {
		switch (sortBy) {
			case SortBy.PRICE:
				return { price: order };
			case SortBy.NAME:
				return { name: order };
			case SortBy.IN_STOCK:
				return { inStock: order };
			case SortBy.CREATED_AT:
				return { createdAt: order };
			default:
				return { createdAt: SortOrder.DESC };
		}
	}
}
