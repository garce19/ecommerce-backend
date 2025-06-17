import { Module } from '@nestjs/common';
import { UserShoppingBagService } from './user-shopping-bag.service';

@Module({
  providers: [UserShoppingBagService]
})
export class UserShoppingBagModule {}
