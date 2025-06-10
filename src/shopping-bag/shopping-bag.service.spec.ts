import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingBagService } from './shopping-bag.service';
import { ShoppingBagEntity } from './shopping-bag.entity/shopping-bag.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ShoppingBagService', () => {
  let service: ShoppingBagService;
  let repository: Repository<ShoppingBagEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ShoppingBagService],
    }).compile();

    service = module.get<ShoppingBagService>(ShoppingBagService);
    repository = module.get<Repository<ShoppingBagEntity>>(getRepositoryToken(ShoppingBagEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
