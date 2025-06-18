import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingBagEntity } from '../shopping-bag/shopping-bag.entity/shopping-bag.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class ShoppingBagProductService {
    constructor(
        @InjectRepository(ShoppingBagEntity)
        private readonly shoppingBagRepository: Repository<ShoppingBagEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {}

    async addProductShoppingBag(productId: string, shoppingBagId: string): Promise<ShoppingBagEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ['shoppingBagItems'],
        });

        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        shoppingBag.shoppingBagItems = [...shoppingBag.shoppingBagItems, product];
        return await this.shoppingBagRepository.save(shoppingBag);
    }

    async findProductByShoppingBagIdProductId(shoppingBagId: string, productId: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ['shoppingBagItems'],
        });

        const shoppingBagProduct: ProductEntity = shoppingBag.shoppingBagItems.find(p => p.id === product.id);

        if (!shoppingBagProduct)
            throw new BusinessLogicException("The product with the given id is not associated with the shopping bag", BusinessError.NOT_FOUND);

        return shoppingBagProduct;
    }

    async findProductsByShoppingBagId(shoppingBagId: string): Promise<ProductEntity[]> {
        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ['shoppingBagItems'],
        });

        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        return shoppingBag.shoppingBagItems;
    }

    async deleteProductFromShoppingBag(shoppingBagId: string, productId: string): Promise<void> {
        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ['shoppingBagItems'],
        });

        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const shoppingBagProduct: ProductEntity = shoppingBag.shoppingBagItems.find(p => p.id === product.id);

        if (!shoppingBagProduct)
            throw new BusinessLogicException("The product with the given id is not associated with the shopping bag", BusinessError.NOT_FOUND);

        shoppingBag.shoppingBagItems = shoppingBag.shoppingBagItems.filter(p => p.id !== product.id);
        await this.shoppingBagRepository.save(shoppingBag);
    }
    
}
