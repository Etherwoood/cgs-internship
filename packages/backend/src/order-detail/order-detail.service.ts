import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderDetailService {
	constructor(private readonly prisma: PrismaService) {}

	private async recalculateOrderTotal(
		tx: Prisma.TransactionClient,
		orderId: string,
	): Promise<void> {
		const orderDetails = await tx.orderDetail.findMany({
			where: { orderId },
		});

		const totalAmount = orderDetails.reduce(
			(sum: number, detail: { priceAtPurchase: Prisma.Decimal }) => {
				return sum + Number(detail.priceAtPurchase);
			},
			0,
		);

		await tx.order.update({
			where: { id: orderId },
			data: { totalAmount },
		});
	}

	async create(
		createOrderDetailDto: CreateOrderDetailDto,
	): Promise<OrderDetailResponseDto> {
		return await this.prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {
				const order = await tx.order.findUnique({
					where: { id: createOrderDetailDto.orderId },
				});

				if (!order) {
					throw new Error('Order not found');
				}

				const product = await tx.product.findUnique({
					where: { id: createOrderDetailDto.productId },
				});

				if (!product) {
					throw new Error('Product not found');
				}

				if (product.inStock < createOrderDetailDto.quantity) {
					throw new Error(
						`Insufficient stock. Available: ${product.inStock}, Requested: ${createOrderDetailDto.quantity}`,
					);
				}

				await tx.product.update({
					where: { id: createOrderDetailDto.productId },
					data: {
						inStock: {
							decrement: createOrderDetailDto.quantity,
						},
					},
				});

				const orderDetail = await tx.orderDetail.create({
					data: {
						orderId: createOrderDetailDto.orderId,
						productId: createOrderDetailDto.productId,
						quantity: createOrderDetailDto.quantity,
						priceAtPurchase:
							Number(product.price) *
							createOrderDetailDto.quantity,
					},
				});

				const allOrderDetails = await tx.orderDetail.findMany({
					where: { orderId: createOrderDetailDto.orderId },
				});
				const totalAmount = allOrderDetails.reduce(
					(
						sum: number,
						detail: {
							quantity: number;
							priceAtPurchase: Prisma.Decimal;
						},
					) => {
						return sum + Number(detail.priceAtPurchase);
					},
					0,
				);

				await tx.order.update({
					where: { id: createOrderDetailDto.orderId },
					data: { totalAmount },
				});

				return new OrderDetailResponseDto(orderDetail);
			},
		);
	}

	async findAll(): Promise<OrderDetailResponseDto[]> {
		const orderDetails = await this.prisma.orderDetail.findMany();
		return orderDetails.map((detail) => new OrderDetailResponseDto(detail));
	}

	async findOne(id: string): Promise<OrderDetailResponseDto> {
		const orderDetail = await this.prisma.orderDetail.findUnique({
			where: { id },
		});
		if (!orderDetail) throw new Error('OrderDetail not found');
		return new OrderDetailResponseDto(orderDetail);
	}

	async findByOrderId(orderId: string): Promise<OrderDetailResponseDto[]> {
		const orderDetails = await this.prisma.orderDetail.findMany({
			where: { orderId },
			include: {
				product: true,
			},
		});
		return orderDetails.map((detail) => new OrderDetailResponseDto(detail));
	}

	async update(
		id: string,
		updateOrderDetailDto: UpdateOrderDetailDto,
	): Promise<OrderDetailResponseDto> {
		return await this.prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {
				const currentOrderDetail = await tx.orderDetail.findUnique({
					where: { id },
					include: { product: true },
				});

				if (!currentOrderDetail) {
					throw new Error('OrderDetail not found');
				}

				if (updateOrderDetailDto.quantity !== undefined) {
					const quantityDifference =
						updateOrderDetailDto.quantity -
						currentOrderDetail.quantity;

					if (quantityDifference > 0) {
						const product = await tx.product.findUnique({
							where: { id: currentOrderDetail.productId },
						});

						if (!product) {
							throw new Error('Product not found');
						}

						if (product.inStock < quantityDifference) {
							throw new Error(
								`Insufficient stock. Available: ${product.inStock}, Needed: ${quantityDifference}`,
							);
						}

						await tx.product.update({
							where: { id: currentOrderDetail.productId },
							data: {
								inStock: {
									decrement: quantityDifference,
								},
							},
						});
					} else if (quantityDifference < 0) {
						await tx.product.update({
							where: { id: currentOrderDetail.productId },
							data: {
								inStock: {
									increment: Math.abs(quantityDifference),
								},
							},
						});
					}
				}

				const updateData: UpdateOrderDetailDto & {
					priceAtPurchase?: number;
				} = { ...updateOrderDetailDto };
				if (updateOrderDetailDto.quantity !== undefined) {
					const product = await tx.product.findUnique({
						where: { id: currentOrderDetail.productId },
					});
					if (product) {
						updateData.priceAtPurchase =
							Number(product.price) *
							updateOrderDetailDto.quantity;
					}
				}

				const updatedOrderDetail = await tx.orderDetail.update({
					where: { id },
					data: updateData,
				});

				const allOrderDetails = await tx.orderDetail.findMany({
					where: { orderId: currentOrderDetail.orderId },
				});
				const totalAmount = allOrderDetails.reduce(
					(
						sum: number,
						detail: {
							quantity: number;
							priceAtPurchase: Prisma.Decimal;
						},
					) => {
						return sum + Number(detail.priceAtPurchase);
					},
					0,
				);
				await tx.order.update({
					where: { id: currentOrderDetail.orderId },
					data: { totalAmount },
				});

				return new OrderDetailResponseDto(updatedOrderDetail);
			},
		);
	}

	async remove(id: string): Promise<void> {
		await this.prisma.$transaction(async (tx) => {
			const orderDetail = await tx.orderDetail.findUnique({
				where: { id },
			});

			if (!orderDetail) {
				throw new Error('OrderDetail not found');
			}

			await tx.product.update({
				where: { id: orderDetail.productId },
				data: {
					inStock: {
						increment: orderDetail.quantity,
					},
				},
			});

			await tx.orderDetail.delete({
				where: { id },
			});

			const allOrderDetails = await tx.orderDetail.findMany({
				where: { orderId: orderDetail.orderId },
			});
			const totalAmount = allOrderDetails.reduce(
				(sum: number, detail: { priceAtPurchase: Prisma.Decimal }) => {
					return sum + Number(detail.priceAtPurchase);
				},
				0,
			);
			await tx.order.update({
				where: { id: orderDetail.orderId },
				data: { totalAmount },
			});
		});
	}
}
