import { ProductEntity } from "src/product/product.entity/product.entity";
import { UserEntity } from "src/user/user.entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingBagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    totalAmount: number;

    @Column()
    totalProducts: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToOne(() => UserEntity, user => user.shoppingBag)
    user: UserEntity;

    @ManyToMany(() => ProductEntity, shoppingBagItem => shoppingBagItem.shoppingBags)
    @JoinTable()
    shoppingBagItems: ProductEntity[];
}
