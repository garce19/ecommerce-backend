import { Module } from '@nestjs/common';
import { UserOrderService } from './user-order.service';

@Module({
  providers: [UserOrderService]
})
export class UserOrderModule {}
