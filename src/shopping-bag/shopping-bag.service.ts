import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingBagEntity } from './shopping-bag.entity/shopping-bag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShoppingBagService {
    constructor(
        @InjectRepository(ShoppingBagEntity)
        private readonly shoppingBagRepository: Repository<ShoppingBagEntity>
    ) {    }
}
