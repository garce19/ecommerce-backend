import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class UserProductService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) { }

    async addProductUser(productId: string, userId: string): Promise<UserEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['products'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        user.products = [...user.products, product];
        return await this.userRepository.save(user);
    }

    async findProductByUserIdProductId(userId: string, productId: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['products'],
        });

        const userProduct: ProductEntity = user.products.find(p => p.id === product.id);

        if (!userProduct)
            throw new BusinessLogicException("The product with the given id is not associated with the user", BusinessError.NOT_FOUND);

        return userProduct;
    }

    async findProductsByUserId(userId: string): Promise<ProductEntity[]> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['products'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        return user.products;
    }

    async associateProductsUser(userId: string, products: ProductEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['products'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        for (let i = 0; i < products.length; i++) {
            const product: ProductEntity = await this.productRepository.findOne({
                where: { id: products[i].id },
            });

            if (!product)
                throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        }

        user.products = products;
        return await this.userRepository.save(user);
    }

    async deleteProductUser(productId: string, userId: string) {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['products'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const userProduct: ProductEntity = user.products.find(p => p.id === product.id);
        if (!userProduct)
            throw new BusinessLogicException("The product with the given id is not associated with the user", BusinessError.NOT_FOUND);

        user.products = user.products.filter(p => p.id !== product.id);
        await this.userRepository.save(user);
    }
}
