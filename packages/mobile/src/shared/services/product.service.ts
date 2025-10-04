import { Product, ProductQueryParams, ProductResponse } from '../types';
import { HttpFactoryService } from './http-factory.service';
import { HttpService } from './http.service';

export class ProductService {
	private readonly module = 'products';

	constructor(private readonly httpService: HttpService) {
		this.httpService = httpService;
	}
	public async createProduct(product: Product): Promise<Product> {
		return this.httpService.post(`${this.module}`, product);
	}

	public async getProducts(
		params: ProductQueryParams,
	): Promise<ProductResponse> {
		const queryString = this.httpService.createQueryLink('', params);
		return this.httpService.get(`${this.module}${queryString}`);
	}

	public async getProduct(id: string): Promise<Product> {
		return this.httpService.get(`${this.module}/products/${id}`);
	}

	public async updateProduct(id: string, product: Product): Promise<Product> {
		return this.httpService.put(`${this.module}/products/${id}`, product);
	}

	public async deleteProduct(id: string): Promise<void> {
		return this.httpService.delete(`${this.module}/products/${id}`);
	}
}

export const productService = new ProductService(
	new HttpFactoryService().createHttpService(),
);
