export interface Order {
	id: string;
	userId: string;
	totalAmount: number;
	paymentStatus: PaymentStatus;
	deliveryStatus: DeliveryStatus;
	createdAt: string;
	updatedAt: string;
}

export interface OrderDetail {
	id: string;
	orderId: string;
	productId: string;
	quantity: number;
	priceAtPurchase: number;
	product?: Product;
}

export interface CartItem {
	id: string;
	product: Product;
	quantity: number;
	priceAtPurchase: number;
}

export enum PaymentStatus {
	COMPLETE = 'COMPLETE',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
}

export enum DeliveryStatus {
	PENDING = 'PENDING',
	IN_TRANSIT = 'IN_TRANSIT',
	DELIVERED = 'DELIVERED',
}

export interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
	description?: string;
	inStock: number;
	createdAt: string;
	updatedAt: string;
}
