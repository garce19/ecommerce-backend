import { Module } from '@nestjs/common';
import { ShoppingBagService } from './shopping-bag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingBagEntity } from './shopping-bag.entity/shopping-bag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingBagEntity])],
  providers: [ShoppingBagService]
})
export class ShoppingBagModule {}
