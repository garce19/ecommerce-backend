import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingBagEntity } from '../shopping-bag/shopping-bag.entity/shopping-bag.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';

@Injectable()
export class ShoppingBagProductService {
    constructor(
        @InjectRepository(ShoppingBagEntity)
        private readonly shoppingBagRepository: Repository<ShoppingBagEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {}
}
