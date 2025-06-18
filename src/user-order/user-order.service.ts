import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';

@Injectable()
export class UserOrderService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ){}
}
