import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity/product.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/business-errors';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) { }

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find({ relations: ['seller', 'orders', 'shoppingBags'] });
    }

    async findOne(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['seller', 'orders', 'shoppingBags'] });
        if (!product) {
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        }
        return product;
    }

    async create(product: ProductEntity): Promise<ProductEntity> {
        if (!product.seller) {
            throw new BusinessLogicException("The product must have a seller", BusinessError.PRECONDITION_FAILED);
        }

        if (product.unitPrice < 0) {
            throw new BusinessLogicException("The product price cannot be negative", BusinessError.PRECONDITION_FAILED);
        }

        if (product.quantity < 0) {
            throw new BusinessLogicException("The product quantity cannot be negative", BusinessError.PRECONDITION_FAILED);
        }

        return await this.productRepository.save(product);
    }

    async update(id: string, product: ProductEntity): Promise<ProductEntity> {
        const persistedProduct = await this.productRepository.findOne({ where: { id } });
        if (!persistedProduct) {
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        }

        persistedProduct.id = id;

        return await this.productRepository.save({ ...persistedProduct, ...product });
    }

    async delete(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.productRepository.remove(product);
    }
}
