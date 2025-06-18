import { Controller, UseInterceptors } from '@nestjs/common';
import { ShoppingBagService } from './shopping-bag.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('shopping-bags')
export class ShoppingBagController {
    constructor(private readonly shoppingBagService: ShoppingBagService) {}
}
