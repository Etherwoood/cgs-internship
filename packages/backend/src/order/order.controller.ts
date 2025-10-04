import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	@Public()
	createOrder(@Body() createOrderDto: CreateOrderDto) {
		return this.orderService.createOrder(createOrderDto);
	}

	@Get()
	@Public()
	getOrders() {
		return this.orderService.getOrders();
	}

	@Get(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.USER, UserRole.ADMIN)
	getOrderById(@Param('id') id: string) {
		return this.orderService.getOrderById(id);
	}

	@Patch(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.USER, UserRole.ADMIN)
	updateOrder(
		@Param('id') id: string,
		@Body() updateOrderDto: UpdateOrderDto,
	) {
		return this.orderService.updateOrder(id, updateOrderDto);
	}

	@Delete(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	deleteOrder(@Param('id') id: string) {
		return this.orderService.deleteOrder(id);
	}

	@Patch(':id/status')
	@Public()
	updateOrderStatus(
		@Param('id') id: string,
		@Query('status') status: string,
	) {
		return this.orderService.updateOrderStatus(id, status);
	}
}
