import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity/order.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
