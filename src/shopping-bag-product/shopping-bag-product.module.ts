import { Module } from '@nestjs/common';
import { ShoppingBagProductService } from './shopping-bag-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingBagEntity } from '../shopping-bag/shopping-bag.entity/shopping-bag.entity';
import { ProductEntity } from '../product/product.entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingBagEntity, ProductEntity])],
  providers: [ShoppingBagProductService]
})
export class ShoppingBagProductModule {}
