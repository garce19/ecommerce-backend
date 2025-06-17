import { Module } from '@nestjs/common';
import { OrderUserService } from './order-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';
import { UserEntity } from '../user/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity])],
  providers: [OrderUserService],
})
export class OrderUserModule {}
