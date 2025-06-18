import { Module } from '@nestjs/common';
import { ProductOrderService } from './product-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';
import { OrderEntity } from '../order/order.entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, OrderEntity])],
  providers: [ProductOrderService]
})
export class ProductOrderModule {}
