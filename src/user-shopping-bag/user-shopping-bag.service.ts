import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { Repository } from 'typeorm';
import { ShoppingBagEntity } from '../shopping-bag/shopping-bag.entity/shopping-bag.entity';

@Injectable()
export class UserShoppingBagService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(ShoppingBagEntity)
        private readonly shoppingBagRepository: Repository<ShoppingBagEntity>
    ){}
}
