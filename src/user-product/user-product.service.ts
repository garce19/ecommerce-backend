import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity/user.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity/product.entity';

@Injectable()
export class UserProductService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ){}
}
