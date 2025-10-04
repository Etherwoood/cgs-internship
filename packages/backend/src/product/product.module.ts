import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { IsExistMiddleware } from '@/shared/middleware/is-exist.middleware';

@Module({
	imports: [PrismaModule],
	controllers: [ProductController],
	providers: [ProductService, IsExistMiddleware],
	exports: [ProductService],
})
export class ProductModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(IsExistMiddleware)
			.forRoutes(
				{ path: 'products/:id', method: RequestMethod.GET },
				{ path: 'products/:id', method: RequestMethod.PATCH },
				{ path: 'products/:id', method: RequestMethod.DELETE },
			);
	}
}
