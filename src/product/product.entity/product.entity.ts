import { Category } from "src/shared/enums";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}