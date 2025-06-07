import { Category } from "src/shared/enums";
import { UserEntity } from "src/user/user.entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}