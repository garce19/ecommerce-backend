import { OrderEntity } from "../../order/order.entity/order.entity";
import { Category } from "../../shared/enums";
import { ShoppingBagEntity } from "../../shopping-bag/shopping-bag.entity/shopping-bag.entity";
import { UserEntity } from "../../user/user.entity/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    unitPrice: number;

    @Column()
    quantity: number;

    @Column()
    description: string;

    @Column()
    category: Category;

    @ManyToOne(() => UserEntity, seller => seller.products)
    seller: UserEntity;

    @ManyToMany(() => ShoppingBagEntity, shoppingBag => shoppingBag.shoppingBagItems)
    shoppingBags: ShoppingBagEntity[];

    @ManyToMany(() => OrderEntity, order => order.products)
    orders: OrderEntity[];
}