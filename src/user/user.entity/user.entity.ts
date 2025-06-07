import { OrderEntity } from "src/order/order.entity/order.entity";
import { UserType } from "src/shared/enums";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    address: string;

    @Column()
    birthdate: Date;

    @Column()
    type: UserType;

    @OneToMany(() => OrderEntity, order => order.seller)
    sellerOrders: OrderEntity[];

    @OneToMany(() => OrderEntity, order => order.buyer)
    buyerOrders: OrderEntity[];
}
