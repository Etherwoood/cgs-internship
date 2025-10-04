import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AtGuard } from '@/auth/guards/at.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async create(
		@Body() createProductDto: CreateProductDto,
	): Promise<ProductResponseDto> {
		return this.productService.create(createProductDto);
	}

	@Get()
	@Public()
	async findAll(@Query() query: ProductQueryDto) {
		return this.productService.findAll(query);
	}

	@Get(':id')
	@Public()
	async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
		return this.productService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async update(
		@Param('id') id: string,
		@Body() updateProductDto: UpdateProductDto,
	): Promise<ProductResponseDto> {
		return this.productService.update(id, updateProductDto);
	}

	@Delete(':id')
	@UseGuards(AtGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async remove(@Param('id') id: string): Promise<void> {
		return this.productService.remove(id);
	}
}
