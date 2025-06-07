import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/business-errors';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({ relations: ['sellerOrders', 'buyerOrders', 'products', 'shoppingBag'] });
    }

    async findOne(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['sellerOrders', 'buyerOrders', 'products', 'shoppingBag'] });
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return user;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (existingUser) {
            throw new BusinessLogicException("The user with the given email already exists", BusinessError.PRECONDITION_FAILED);
        }
        return await this.userRepository.save(user);
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const persistedUser: UserEntity = await this.userRepository.findOne({ where: { id } });
        if (!persistedUser) {
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        }

        persistedUser.id = id;
        
        return await this.userRepository.save({ ...persistedUser, ...user });
    }

    async delete(id: string) {
        const user: UserEntity = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.userRepository.remove(user);
    }
}
