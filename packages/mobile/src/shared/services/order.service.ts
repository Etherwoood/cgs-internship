import { Order, OrderDetail } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export class OrderService {
	static async getOrders(): Promise<Order[]> {
		try {
			const response = await fetch(`${API_BASE_URL}/orders`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const orders = await response.json();
			return orders;
		} catch (error) {
			return [];
		}
	}

	static async getOrderById(id: string): Promise<Order | null> {
		try {
			const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const order = await response.json();
			return order;
		} catch (error) {
			return null;
		}
	}

	static async getOrderDetails(orderId: string): Promise<OrderDetail[]> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/order-details/order/${orderId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const orderDetails = await response.json();
			return orderDetails;
		} catch (error) {
			return [];
		}
	}

	static async createOrder(
		userId: string,
		cartItems: any[],
	): Promise<Order | null> {
		try {
			for (const cartItem of cartItems) {
				if (cartItem.quantity > cartItem.product.inStock) {
					throw new Error(
						`Insufficient stock for ${cartItem.product.name}. Available: ${cartItem.product.inStock}, Requested: ${cartItem.quantity}`,
					);
				}
			}

			const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId }),
			});

			if (!orderResponse.ok) {
				const errorText = await orderResponse.text();
				throw new Error(
					`HTTP error! status: ${orderResponse.status}, message: ${errorText}`,
				);
			}

			const order = await orderResponse.json();

			for (const cartItem of cartItems) {
				try {
					const requestBody = {
						orderId: order.id,
						productId: cartItem.product.id,
						quantity: cartItem.quantity,
					};

					const orderDetailResponse = await fetch(
						`${API_BASE_URL}/order-details`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(requestBody),
						},
					);

					if (!orderDetailResponse.ok) {
						const errorText = await orderDetailResponse.text();
					}
				} catch (error) {}
			}

			return order;
		} catch (error) {
			return null;
		}
	}

	static async updateOrderStatus(
		orderId: string,
		paymentStatus: string,
	): Promise<Order | null> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/orders/${orderId}/status?status=${paymentStatus}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorText}`,
				);
			}

			const updatedOrder = await response.json();
			return updatedOrder;
		} catch (error) {
			return null;
		}
	}
}

export { OrderService as orderService };
