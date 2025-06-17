import { Module } from '@nestjs/common';
import { UserShoppingBagService } from './user-shopping-bag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { ShoppingBagEntity } from '../shopping-bag/shopping-bag.entity/shopping-bag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ShoppingBagEntity])],
  providers: [UserShoppingBagService]
})
export class UserShoppingBagModule {}
