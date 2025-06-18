import { Test, TestingModule } from '@nestjs/testing';
import { ProductUserService } from './product-user.service';

describe('ProductUserService', () => {
  let service: ProductUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUserService],
    }).compile();

    service = module.get<ProductUserService>(ProductUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
