import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
