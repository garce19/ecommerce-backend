import { Module } from '@nestjs/common';
import { OrderUserService } from './order-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderUserService]
})
export class OrderUserModule {}
