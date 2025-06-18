import { Controller } from '@nestjs/common';
import { ShoppingBagService } from './shopping-bag.service';

@Controller('shopping-bags')
export class ShoppingBagController {
    constructor(private readonly shoppingBagService: ShoppingBagService) {}
}
