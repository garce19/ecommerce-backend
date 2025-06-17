import { Module } from '@nestjs/common';
import { OrderUserService } from './order-user.service';

@Module({
  providers: [OrderUserService]
})
export class OrderUserModule {}
