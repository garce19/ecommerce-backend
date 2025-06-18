import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
}
