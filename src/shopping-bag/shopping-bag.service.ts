import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingBagEntity } from './shopping-bag.entity/shopping-bag.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class ShoppingBagService {
    constructor(
        @InjectRepository(ShoppingBagEntity)
        private readonly shoppingBagRepository: Repository<ShoppingBagEntity>
    ) { }

    async findAll(): Promise<ShoppingBagEntity[]> {
        return await this.shoppingBagRepository.find({ relations: ['user', 'shoppingBagItems'] });
    }

    async findOne(id: string): Promise<ShoppingBagEntity> {
        const shoppingBag = await this.shoppingBagRepository.findOne({ where: { id } });
        if (!shoppingBag) {
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);
        }
        return shoppingBag;
    }

    async create(shoppingBag: ShoppingBagEntity): Promise<ShoppingBagEntity> {
        return await this.shoppingBagRepository.save(shoppingBag);
    }

    async update(id: string, shoppingBag: ShoppingBagEntity): Promise<ShoppingBagEntity> {
        const persistedShoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({ where: { id } });
        if (!persistedShoppingBag) {
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);
        }

        persistedShoppingBag.id = id;

        return await this.shoppingBagRepository.save({ ...persistedShoppingBag, ...shoppingBag });
    }

    async delete(id: string) {
        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({ where: { id } });
        if (!shoppingBag) {
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.shoppingBagRepository.remove(shoppingBag);
    }
}
