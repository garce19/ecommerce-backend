import { Module } from '@nestjs/common';
import { UserProductService } from './user-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { ProductEntity } from '../product/product.entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProductEntity])], 
  providers: [UserProductService]
})
export class UserProductModule {}
