import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ShoppingBagModule } from './shopping-bag/shopping-bag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity/user.entity';
import { OrderEntity } from './order/order.entity/order.entity';
import { ProductEntity } from './product/product.entity/product.entity';
import { ShoppingBagEntity } from './shopping-bag/shopping-bag.entity/shopping-bag.entity';
import { UserShoppingBagModule } from './user-shopping-bag/user-shopping-bag.module';
import { UserOrderModule } from './user-order/user-order.module';
import { UserProductModule } from './user-product/user-product.module';
import { ShoppingBagProductModule } from './shopping-bag-product/shopping-bag-product.module';

@Module({
  imports: [UserModule, OrderModule, ProductModule, ShoppingBagModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'ecommerce',
      entities: [UserEntity, OrderEntity, ProductEntity, ShoppingBagEntity],
      dropSchema: true,
      synchronize: true,
    }),
    UserShoppingBagModule,
    UserOrderModule,
    UserProductModule,
    ShoppingBagProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
