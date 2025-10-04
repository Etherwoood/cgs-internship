import { OrderDetail, Product } from '@prisma/client';

export class OrderDetailResponseDto {
	id: string;
	orderId: string;
	productId: string;
	quantity: number;
	priceAtPurchase: number;
	product?: Product;

	constructor(orderDetail: OrderDetail & { product?: Product }) {
		this.id = orderDetail.id;
		this.orderId = orderDetail.orderId;
		this.productId = orderDetail.productId;
		this.quantity = orderDetail.quantity;
		this.priceAtPurchase = Number(orderDetail.priceAtPurchase);
		this.product = orderDetail.product;
	}
}
