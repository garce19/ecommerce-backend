import { Test, TestingModule } from '@nestjs/testing';
import { UserShoppingBagService } from './user-shopping-bag.service';

describe('UserShoppingBagService', () => {
  let service: UserShoppingBagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserShoppingBagService],
    }).compile();

    service = module.get<UserShoppingBagService>(UserShoppingBagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
