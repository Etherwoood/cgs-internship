import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-responce.dto';

@Injectable()
export class OrderService {
	private readonly prisma: PrismaService;

	constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	async createOrder(
		createOrderDto: CreateOrderDto,
	): Promise<OrderResponseDto> {
		const order = await this.prisma.order.create({
			data: {
				...createOrderDto,
				totalAmount: 0,
			},
		});
		return new OrderResponseDto(order);
	}

	async getOrders() {
		return this.prisma.order.findMany();
	}

	async getOrderById(id: string) {
		return this.prisma.order.findUnique({ where: { id } });
	}

	async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
		return this.prisma.order.update({
			where: { id },
			data: updateOrderDto,
		});
	}

	async deleteOrder(id: string) {
		return this.prisma.order.delete({ where: { id } });
	}

	async updateOrderStatus(id: string, paymentStatus: string) {
		const updatedOrder = await this.prisma.order.update({
			where: { id },
			data: { paymentStatus: paymentStatus as any },
		});

		return new OrderResponseDto(updatedOrder);
	}
}
