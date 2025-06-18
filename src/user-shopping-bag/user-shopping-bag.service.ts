import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { Repository } from 'typeorm';
import { ShoppingBagEntity } from '../shopping-bag/shopping-bag.entity/shopping-bag.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class UserShoppingBagService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(ShoppingBagEntity)
        private readonly shoppingBagRepository: Repository<ShoppingBagEntity>
    ) { }

    async addShoppingBagUser(shoppingBagId: string, userId: string): Promise<ShoppingBagEntity> {
        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ["user", "shoppingBagItems"]
        });

        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        if (shoppingBag.user)
            throw new BusinessLogicException("The shopping bag already has a user assigned", BusinessError.PRECONDITION_FAILED);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["shoppingBag", "products", "sellerOrders", "buyerOrders"]
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        shoppingBag.user = user;
        return await this.shoppingBagRepository.save(shoppingBag);
    }

    async findShoppingBagByUserIdShoppingBagId(userId: string, shoppingBagId: string): Promise<ShoppingBagEntity> {
        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ["user", "shoppingBagItems"]
        });
        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["shoppingBag", "products", "sellerOrders", "buyerOrders"]
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const userShoppingBag: ShoppingBagEntity = user.shoppingBag;
        if (!userShoppingBag)
            throw new BusinessLogicException("The user does not have a shopping bag", BusinessError.PRECONDITION_FAILED);

        return userShoppingBag
    }

    async findShoppingBagByUserId(userId: string): Promise<ShoppingBagEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["shoppingBag", "products", "sellerOrders", "buyerOrders"]
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        return user.shoppingBag;
    }

    async associateShoppingBagToUser(shoppingBagId: string, userId: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["shoppingBag", "products", "sellerOrders", "buyerOrders"]
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ["user", "shoppingBagItems"]
        });

        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        user.shoppingBag = shoppingBag;
        return await this.userRepository.save(user);
    }

    async deleteShoppingBagUser(shoppingBagId: string, userId: string) {
        const shoppingBag: ShoppingBagEntity = await this.shoppingBagRepository.findOne({
            where: { id: shoppingBagId },
            relations: ["user", "shoppingBagItems"]
        });

        if (!shoppingBag)
            throw new BusinessLogicException("The shopping bag with the given id was not found", BusinessError.NOT_FOUND);

        const user: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["shoppingBag", "products", "sellerOrders", "buyerOrders"]
        });

        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const userShoppingBag: ShoppingBagEntity = user.shoppingBag;
        if (!userShoppingBag)
            throw new BusinessLogicException("The user does not have a shopping bag", BusinessError.PRECONDITION_FAILED);

        user.shoppingBag = null;
        await this.shoppingBagRepository.remove(shoppingBag);
    }
}
