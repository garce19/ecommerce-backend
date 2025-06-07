import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity/order.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/business-errors';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) { }

    async findAll(): Promise<OrderEntity[]> {
        return await this.orderRepository.find({ relations: ['seller', 'buyer', 'products'] });
    }

    async findOne(id: string): Promise<OrderEntity> {
        const order = await this.orderRepository.findOne({ where: { id }, relations: ['seller', 'buyer', 'products'] });
        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        return order;
    }

    async create(order: OrderEntity): Promise<OrderEntity> {
        if (!order.seller || !order.buyer || order.products.length === 0) {
            throw new BusinessLogicException("The order must have a seller, a buyer, and at least one product", BusinessError.PRECONDITION_FAILED);
        }

        if (order.amount <= 0) {
            throw new BusinessLogicException("The order amount must be greater than zero", BusinessError.PRECONDITION_FAILED);
        }

        if (order.date < new Date()) {
            throw new BusinessLogicException("The order date must be in the present or future", BusinessError.PRECONDITION_FAILED);
        }

        return await this.orderRepository.save(order);
    }

    async update(id: string, order: OrderEntity): Promise<OrderEntity> {
        const persistedOrder: OrderEntity = await this.orderRepository.findOne({ where: { id } });
        if (!persistedOrder)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);

        persistedOrder.id = id;

        return await this.orderRepository.save({ ...persistedOrder, ...order });
    }

    async delete(id: string) {
        const order: OrderEntity = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new BusinessLogicException("The order with the given id was not found", BusinessError.NOT_FOUND);
        await this.orderRepository.remove(order);
    }
}
