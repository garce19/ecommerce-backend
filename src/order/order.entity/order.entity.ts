import { UserEntity } from "src/user/user.entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}
