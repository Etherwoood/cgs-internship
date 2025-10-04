import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';
import { AtGuard } from '@/auth/guards/at.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('order-details')
export class OrderDetailController {
	constructor(private readonly orderDetailService: OrderDetailService) {}

	@Post()
	@Public()
	async create(
		@Body() createOrderDetailDto: CreateOrderDetailDto,
	): Promise<OrderDetailResponseDto> {
		return this.orderDetailService.create(createOrderDetailDto);
	}

	@Get()
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async findAll(): Promise<OrderDetailResponseDto[]> {
		return this.orderDetailService.findAll();
	}

	@Get('order/:orderId')
	@Public()
	async findByOrderId(
		@Param('orderId') orderId: string,
	): Promise<OrderDetailResponseDto[]> {
		return this.orderDetailService.findByOrderId(orderId);
	}

	@Get(':id')
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.USER, UserRole.ADMIN)
	async findOne(@Param('id') id: string): Promise<OrderDetailResponseDto> {
		return this.orderDetailService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.USER, UserRole.ADMIN)
	async update(
		@Param('id') id: string,
		@Body() updateOrderDetailDto: UpdateOrderDetailDto,
	): Promise<OrderDetailResponseDto> {
		return this.orderDetailService.update(id, updateOrderDetailDto);
	}

	@Delete(':id')
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.USER, UserRole.ADMIN)
	async remove(@Param('id') id: string): Promise<void> {
		return this.orderDetailService.remove(id);
	}
}
