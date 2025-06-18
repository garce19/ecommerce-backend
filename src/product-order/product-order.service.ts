import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class ProductOrderService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ){}

    async addOrderProduct(productId: string, orderId: string): Promise<ProductEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            
        })

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['orders'],
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        product.orders = [...product.orders, order];
        return await this.productRepository.save(product);
    }

    async findProductByOrderIdProductId(orderId: string, productId: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['products'],
        });

        const orderProduct: ProductEntity = order.products.find(p => p.id === product.id);
        if (!orderProduct)
            throw new BusinessLogicException("The product with the given id is not associated with the order", BusinessError.NOT_FOUND);

        return orderProduct;
    }

    async findProductsByOrderId(orderId: string): Promise<ProductEntity[]> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['products'],
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        return order.products;
    }

    async associateProductsToOrder(orderId: string, products: ProductEntity[]): Promise<OrderEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['products'],
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        for (let i = 0; i < products.length; i++) {
            const product: ProductEntity = await this.productRepository.findOne({
                where: { id: products[i].id }
            });

            if (!product)
                throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

            order.products = products
            return await this.orderRepository.save(order);
        }
    }

    async deleteOrderProduct(orderId: string, productId: string): Promise<void> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['products'],
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const product: ProductEntity = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

        const orderProduct: ProductEntity = order.products.find(p => p.id === product.id);
        if (!orderProduct)
            throw new BusinessLogicException("The product with the given id is not associated with the order", BusinessError.NOT_FOUND);

        order.products = order.products.filter(p => p.id !== product.id);
        await this.orderRepository.save(order);
    }


}
