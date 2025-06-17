import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';
import { read } from 'fs';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity/user.entity';

@Injectable()
export class OrderUserService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}
}
