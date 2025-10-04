import { Order, PaymentStatus, DeliveryStatus } from '@prisma/client';

export class OrderResponseDto {
	id: string;
	userId: string;
	totalAmount: number;
	paymentStatus: PaymentStatus;
	deliveryStatus: DeliveryStatus;
	createdAt: Date;
	updatedAt: Date;

	constructor(order: Order) {
		this.id = order.id;
		this.userId = order.userId;
		this.totalAmount = Number(order.totalAmount);
		this.paymentStatus = order.paymentStatus;
		this.deliveryStatus = order.deliveryStatus;
		this.createdAt = order.createdAt;
		this.updatedAt = order.updatedAt;
	}
}
