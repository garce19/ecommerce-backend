import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingBagProductService } from './shopping-bag-product.service';

describe('ShoppingBagProductService', () => {
  let service: ShoppingBagProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingBagProductService],
    }).compile();

    service = module.get<ShoppingBagProductService>(ShoppingBagProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
