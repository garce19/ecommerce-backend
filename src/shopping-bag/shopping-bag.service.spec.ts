import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingBagService } from './shopping-bag.service';
import { ShoppingBagEntity } from './shopping-bag.entity/shopping-bag.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker/.';
import { UserEntity } from '../user/user.entity/user.entity';
import { ProductEntity } from '../product/product.entity/product.entity';

describe('ShoppingBagService', () => {
  let service: ShoppingBagService;
  let repository: Repository<ShoppingBagEntity>;
  let shoppingBagList: ShoppingBagEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ShoppingBagService],
    }).compile();

    service = module.get<ShoppingBagService>(ShoppingBagService);
    repository = module.get<Repository<ShoppingBagEntity>>(getRepositoryToken(ShoppingBagEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all shoppingBags', async () => {
    const shoppingBags: ShoppingBagEntity[] = await service.findAll();
    expect(shoppingBags).not.toBeNull();
    expect(shoppingBags).toHaveLength(shoppingBagList.length);
  });

  it('findOne should return a shoppingBag by id', async () => {
    const storedShoppingBag: ShoppingBagEntity = shoppingBagList[0];
    const shoppingBag: ShoppingBagEntity = await service.findOne(storedShoppingBag.id);
    expect(shoppingBag).not.toBeNull();
    expect(shoppingBag.totalAmount).toEqual(storedShoppingBag.totalAmount);
    expect(shoppingBag.totalProducts).toEqual(storedShoppingBag.totalProducts);
    expect(shoppingBag.createdAt).toEqual(storedShoppingBag.createdAt);
    expect(shoppingBag.updatedAt).toEqual(storedShoppingBag.updatedAt);
  });

  it('findOne should throw an exception for an invalid shoppingBag', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The shopping bag with the given id was not found');
  });

  it('create should return a new shoppingBag', async () => {
    const shoppingBag: ShoppingBagEntity = {
      id: '',
      totalAmount: faker.number.int({ min: 1, max: 1000 }),
      totalProducts: faker.number.int({ min: 1, max: 100 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      user: Object.assign(new UserEntity(), {}),
      shoppingBagItems: [Object.assign(new ProductEntity(), {})],
    };

    const newShoppingBag: ShoppingBagEntity = await service.create(shoppingBag);
    expect(newShoppingBag).not.toBeNull();
    
    const storedShoppingBag: ShoppingBagEntity = await repository.findOne({ where: { id: newShoppingBag.id } });
    expect(storedShoppingBag).not.toBeNull();
    expect(storedShoppingBag.totalAmount).toEqual(newShoppingBag.totalAmount);
    expect(storedShoppingBag.totalProducts).toEqual(newShoppingBag.totalProducts);
    expect(storedShoppingBag.createdAt).toEqual(newShoppingBag.createdAt);
    expect(storedShoppingBag.updatedAt).toEqual(newShoppingBag.updatedAt);
  });

  it('update should modify a shoppingBag', async () => {
    const shoppingBag: ShoppingBagEntity = shoppingBagList[0];
    shoppingBag.totalAmount = faker.number.int({ min: 1, max: 1000 });
    shoppingBag.totalProducts = faker.number.int({ min: 1, max: 100 });

    const updatedShoppingBag: ShoppingBagEntity = await service.update(shoppingBag.id, shoppingBag);
    expect(updatedShoppingBag).not.toBeNull();
    
    const storedShoppingBag: ShoppingBagEntity = await repository.findOne({ where: { id: shoppingBag.id } });
    expect(storedShoppingBag).not.toBeNull();
    expect(storedShoppingBag.totalAmount).toEqual(shoppingBag.totalAmount);
    expect(storedShoppingBag.totalProducts).toEqual(shoppingBag.totalProducts);
  });

  it('update should throw an exception for an invalid shoppingBag', async () => {
    let shoppingBag: ShoppingBagEntity = shoppingBagList[0];
    shoppingBag = {
      ...shoppingBag,
      totalProducts: 3,
    };
    await expect(() => service.update("0", shoppingBag)).rejects.toHaveProperty('message', 'The shopping bag with the given id was not found');
  });

  it('delete should remove a shoppingBag', async () => {
    const shoppingBag: ShoppingBagEntity = shoppingBagList[0];
    await service.delete(shoppingBag.id);
    
    const deletedShoppingBag: ShoppingBagEntity = await repository.findOne({ where: { id: shoppingBag.id } });
    expect(deletedShoppingBag).toBeNull();
  });

  it('delete should throw an exception for an invalid shoppingBag', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'The shopping bag with the given id was not found');
  });

  const seedDatabase = async () => {
    repository.clear();
    shoppingBagList = [];
    for (let i = 0; i < 5; i++) {
      const shoppingBag: ShoppingBagEntity = await repository.save({
        totalAmount: faker.number.int({ min: 1, max: 1000 }),
        totalProducts: faker.number.int({ min: 1, max: 100 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      })
      shoppingBagList.push(shoppingBag);
    }
  };
});
