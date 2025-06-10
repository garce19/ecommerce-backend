import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "../../order/order.entity/order.entity";
import { ProductEntity } from "../../product/product.entity/product.entity";
import { UserEntity } from "../../user/user.entity/user.entity";
import { ShoppingBagEntity } from "../../shopping-bag/shopping-bag.entity/shopping-bag.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        synchronize: true,
        entities: [OrderEntity, ProductEntity, UserEntity, ShoppingBagEntity],
    }),
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, UserEntity, ShoppingBagEntity]),
]