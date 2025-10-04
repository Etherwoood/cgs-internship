import { Product } from '@prisma/client';

export class ProductResponseDto {
	id: string;
	name: string;
	description: string | null;
	price: number;
	category: string;
	inStock: number;
	createdAt: Date;
	updatedAt: Date;

	constructor(product: Product) {
		this.id = product.id;
		this.name = product.name;
		this.description = product.description;
		this.price = Number(product.price);
		this.category = product.category;
		this.inStock = product.inStock;
		this.createdAt = product.createdAt;
		this.updatedAt = product.updatedAt;
	}
}
