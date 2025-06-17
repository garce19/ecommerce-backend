import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';
import { read } from 'fs';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class OrderUserService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async addSellerOrder(orderId: string, userId: string): Promise<OrderEntity> {
        const seller: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        })

        if (!seller)
            throw new BusinessLogicException("The seller with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["seller", "buyer", "products"]
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        if (order.seller)
            throw new BusinessLogicException("The order already has a seller assigned", BusinessError.PRECONDITION_FAILED);

        order.seller = seller;
        return await this.orderRepository.save(order);
    }

    async addBuyerOrder(orderId: string, userId: string): Promise<OrderEntity> {
        const buyer: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!buyer)
            throw new BusinessLogicException("The buyer with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["seller", "buyer", "products"]
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        if (order.buyer)
            throw new BusinessLogicException("The order already has a buyer assigned", BusinessError.PRECONDITION_FAILED);

        order.buyer = buyer;
        return await this.orderRepository.save(order);
    }

    async findSellerByOrderIdSellerId(orderId: string, userId: string): Promise<UserEntity> {
        const seller: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
        })

        if (!seller)
            throw new BusinessLogicException("The seller with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["seller"]
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const orderSeller: UserEntity = order.seller;
        if (!orderSeller)
            throw new BusinessLogicException("The order does not have a seller assigned", BusinessError.PRECONDITION_FAILED);

        return orderSeller;
    }

    async findBuyerByOrderIdBuyerId(orderId: string, userId: string): Promise<UserEntity> {
        const buyer: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!buyer)
            throw new BusinessLogicException("The buyer with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["buyer"]
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const orderBuyer: UserEntity = order.buyer;
        if (!orderBuyer)
            throw new BusinessLogicException("The order does not have a buyer assigned", BusinessError.PRECONDITION_FAILED);

        return orderBuyer;
    }

    async associateSellerOrder(orderId: string, userId: string): Promise<OrderEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["seller"]
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const seller: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!seller)
            throw new BusinessLogicException("The seller with the given id was not found", BusinessError.NOT_FOUND);

        if (order.seller && order.seller.id !== userId)
            throw new BusinessLogicException("The order already has a different seller assigned", BusinessError.PRECONDITION_FAILED);

        order.seller = seller;
        return await this.orderRepository.save(order);
    }

    async associateBuyerOrder(orderId: string, userId: string): Promise<OrderEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["buyer"]
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const buyer: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!buyer)
            throw new BusinessLogicException("The buyer with the given id was not found", BusinessError.NOT_FOUND);

        if (order.buyer && order.buyer.id !== userId)
            throw new BusinessLogicException("The order already has a different buyer assigned", BusinessError.PRECONDITION_FAILED);

        order.buyer = buyer;
        return await this.orderRepository.save(order);
    }

    async deleteSellerOrder(orderId: string, userId: string) {
        const seller: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!seller)
            throw new BusinessLogicException("The seller with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["seller"]
        });
        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        if (!order.seller || order.seller.id !== userId)
            throw new BusinessLogicException("The order does not have the specified seller assigned", BusinessError.PRECONDITION_FAILED);

        const orderSeller: UserEntity = order.seller;

        if (!orderSeller)
            throw new BusinessLogicException("The order does not have a seller assigned", BusinessError.PRECONDITION_FAILED);

        order.seller = null;
        await this.orderRepository.save(order);
    }

    async deleteBuyerOrder(orderId: string, userId: string) {
        const buyer: UserEntity = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!buyer)
            throw new BusinessLogicException("The buyer with the given id was not found", BusinessError.NOT_FOUND);

        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["buyer"]
        });
        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        if (!order.buyer || order.buyer.id !== userId)
            throw new BusinessLogicException("The order does not have the specified buyer assigned", BusinessError.PRECONDITION_FAILED);

        const orderBuyer: UserEntity = order.buyer;

        if (!orderBuyer)
            throw new BusinessLogicException("The order does not have a buyer assigned", BusinessError.PRECONDITION_FAILED);

        order.buyer = null;
        await this.orderRepository.save(order);
    }
}
