import { Controller, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService){}
}
