import { Module } from '@nestjs/common';
import { ProductUserService } from './product-user.service';

@Module({
  providers: [ProductUserService]
})
export class ProductUserModule {}
