import { Module } from '@nestjs/common';
import { UserProductService } from './user-product.service';

@Module({
  providers: [UserProductService]
})
export class UserProductModule {}
