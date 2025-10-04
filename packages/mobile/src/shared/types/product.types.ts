export interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductQueryParams {
	name?: string;
	sortBy?: 'price' | 'name' | 'createdAt';
	order?: 'asc' | 'desc';
	page?: number;
	limit?: number;

	[key: string]: unknown;
}

export interface ProductResponse {
	products: Product[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export enum SortBy {
	PRICE = 'price',
	NAME = 'name',
	CREATED_AT = 'createdAt',
}
export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}
