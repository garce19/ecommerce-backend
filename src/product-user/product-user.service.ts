import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity/user.entity';

@Injectable()
export class ProductUserService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}
}
