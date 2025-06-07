import { ProductEntity } from "src/product/product.entity/product.entity";
import { UserEntity } from "src/user/user.entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column()
    date: Date;

    @ManyToOne(() => UserEntity, seller => seller.sellerOrders)
    seller: UserEntity;

    @ManyToOne(() => UserEntity, buyer => buyer.buyerOrders)
    buyer: UserEntity;

    @ManyToMany(() => ProductEntity, product => product.orders)
    @JoinTable()
    products: ProductEntity[];
}
