import { Module } from '@nestjs/common';
import { UserOrderService } from './user-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { OrderEntity } from '../order/order.entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OrderEntity])],
  providers: [UserOrderService]
})
export class UserOrderModule {}
