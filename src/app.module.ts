import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ShoppingBagModule } from './shopping-bag/shopping-bag.module';

@Module({
  imports: [UserModule, OrderModule, ProductModule, ShoppingBagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
