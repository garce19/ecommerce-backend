import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';

@Injectable()
export class ProductOrderService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ){}
}
