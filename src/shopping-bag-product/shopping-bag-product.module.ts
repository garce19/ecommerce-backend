import { Module } from '@nestjs/common';
import { ShoppingBagProductService } from './shopping-bag-product.service';

@Module({
  providers: [ShoppingBagProductService]
})
export class ShoppingBagProductModule {}
