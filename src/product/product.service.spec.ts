import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import { Category, UserType } from '../shared/enums';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from '../user/user.entity/user.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productList.length);
  })

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.id).toEqual(storedProduct.id);
    expect(product.name).toEqual(storedProduct.name);
    expect(product.unitPrice).toEqual(storedProduct.unitPrice);
    expect(product.quantity).toEqual(storedProduct.quantity);
    expect(product.description).toEqual(storedProduct.description);
    expect(product.category).toEqual(storedProduct.category);
  })

  it('findOne should throw an exception for an invalid product id', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'The product with the given id was not found');
  });

  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: '',
      name: faker.commerce.productName(),
      unitPrice: parseInt(faker.commerce.price({ dec: 0 })),
      quantity: faker.number.int({ min: 1, max: 100 }),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(Object.values(Category)),
      seller: Object.assign(new UserEntity(), {}),
      shoppingBags: [],
      orders: [],
  }

    const newProduct: ProductEntity = await service.create(product);
  expect(newProduct).not.toBeNull();

  const storedProduct: ProductEntity = await repository.findOne({ where: { id: newProduct.id } });
  expect(storedProduct).not.toBeNull();
  expect(storedProduct.name).toEqual(newProduct.name);
  expect(storedProduct.unitPrice).toEqual(newProduct.unitPrice);
  expect(storedProduct.quantity).toEqual(newProduct.quantity);
  expect(storedProduct.description).toEqual(newProduct.description);
  expect(storedProduct.category).toEqual(newProduct.category);
})

it('update should modify a product', async () => {
  const product: ProductEntity = productList[0];
  product.name = 'New Name';
  product.unitPrice = 100.00;

  const updatedProudct: ProductEntity = await service.update(product.id, product);
  expect(updatedProudct).not.toBeNull();

  const storedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } });
  expect(storedProduct).not.toBeNull();
  expect(storedProduct.name).toEqual(product.name);
  expect(storedProduct.unitPrice).toEqual(product.unitPrice);
});

it('update should throw an exception for an invalid product id', async () => {
  let product: ProductEntity = productList[0];
  product = {
    ...product,
    name: 'New Name',
    unitPrice: 100.00,
  };

  await expect(() => service.update("0", product)).rejects.toHaveProperty('message', 'The product with the given id was not found');
});

it('delete should remove a product', async () => {
  const product: ProductEntity = productList[0];
  await service.delete(product.id);

  const deletedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } });
  expect(deletedProduct).toBeNull();
});

it('delete should throw an exception for an invalid product id', async () => {
  await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'The product with the given id was not found');
});

const seedDatabase = async () => {
  repository.clear();
  productList = [];
  for (let i = 0; i < 5; i++) {
    const product: ProductEntity = await repository.save({
      name: faker.commerce.productName(),
      unitPrice: parseInt(faker.commerce.price({ dec: 0 })),
      quantity: faker.number.int({ min: 1, max: 100 }),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(Object.values(Category)),
    })
    productList.push(product);
  }
}
});
