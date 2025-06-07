import { Category } from "src/shared/enums";
import { ShoppingBagEntity } from "src/shopping-bag/shopping-bag.entity/shopping-bag.entity";
import { UserEntity } from "src/user/user.entity/user.entity";
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
}