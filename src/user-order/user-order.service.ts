import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { Repository } from 'typeorm';
import { OrderEntity } from '../order/order.entity/order.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class UserOrderService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) { }

    async addOrderSeller(orderId: string, sellerId: string): Promise<UserEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['sellerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        user.sellerOrders = [...user.sellerOrders, order];
        return await this.userRepository.save(user);
    }

    async addOrderBuyer(orderId: string, buyerId: string): Promise<UserEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: buyerId },
            relations: ['buyerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        user.buyerOrders = [...user.buyerOrders, order];
        return await this.userRepository.save(user);
    }

    async findOrderBySellerIdOrderId(sellerId: string, orderId: string): Promise<OrderEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId }
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['sellerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const orderSeller: OrderEntity = user.sellerOrders.find(o => o.id === orderId);
        if (!orderSeller)
            throw new BusinessLogicException("The order with the given id is not associated with the user", BusinessError.NOT_FOUND);

        return orderSeller;
    }

    async findOrderByBuyerIdOrderId(buyerId: string, orderId: string): Promise<OrderEntity> {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId }
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: buyerId },
            relations: ['buyerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const orderBuyer: OrderEntity = user.buyerOrders.find(o => o.id === orderId);
        if (!orderBuyer)
            throw new BusinessLogicException("The order with the given id is not associated with the user", BusinessError.NOT_FOUND);

        return orderBuyer;
    }

    async findOrdersBySellerId(sellerId: string): Promise<OrderEntity[]> {
        const seller: UserEntity = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['sellerOrders'],
        });

        if (!seller)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        return seller.sellerOrders;
    }

    async findOrdersByBuyerId(buyerId: string): Promise<OrderEntity[]> {
        const buyer: UserEntity = await this.userRepository.findOne({
            where: { id: buyerId },
            relations: ['buyerOrders'],
        });

        if (!buyer)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        return buyer.buyerOrders;
    }

    async associateOrdersSeller(sellerId: string, orders: OrderEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['sellerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        for (let i = 0; i < orders.length; i++) {
            const order: OrderEntity = await this.orderRepository.findOne({
                where: { id: orders[i].id },
            });

            if (!order)
                throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

            user.sellerOrders = orders;
            return await this.userRepository.save(user);
        }
    }

    async associateOrdersBuyer(buyerId: string, orders: OrderEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: buyerId },
            relations: ['buyerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        for (let i = 0; i < orders.length; i++) {
            const order: OrderEntity = await this.orderRepository.findOne({
                where: { id: orders[i].id },
            });

            if (!order)
                throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

            user.buyerOrders = orders;
            return await this.userRepository.save(user);
        }
    }

    async deleteOrderSeller(orderId: string, sellerId: string) {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['sellerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const sellerOrder: OrderEntity = user.sellerOrders.find(o => o.id === orderId);
        if (!sellerOrder)
            throw new BusinessLogicException("The order with the given id is not associated with the user", BusinessError.NOT_FOUND);

        user.sellerOrders = user.sellerOrders.filter(o => o.id !== orderId);
        await this.userRepository.save(user);
    }

    async deleteOrderBuyer(orderId: string, buyerId: string) {
        const order: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: buyerId },
            relations: ['buyerOrders'],
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const buyerOrder: OrderEntity = user.buyerOrders.find(o => o.id === orderId);
        if (!buyerOrder)
            throw new BusinessLogicException("The order with the given id is not associated with the user", BusinessError.NOT_FOUND);

        user.buyerOrders = user.buyerOrders.filter(o => o.id !== orderId);
        await this.userRepository.save(user);
    }
}
