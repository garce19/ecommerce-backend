import { Module } from '@nestjs/common';
import { ShoppingBagService } from './shopping-bag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingBagEntity } from './shopping-bag.entity/shopping-bag.entity';
import { ShoppingBagController } from './shopping-bag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingBagEntity])],
  providers: [ShoppingBagService],
  controllers: [ShoppingBagController]
})
export class ShoppingBagModule {}
