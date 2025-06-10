import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity/order.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import { UserEntity } from '../user/user.entity/user.entity';
import { ProductEntity } from '../product/product.entity/product.entity';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<OrderEntity>;
  let orderList: OrderEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all orders', async () => {
    const orders: OrderEntity[] = await service.findAll();
    expect(orders).not.toBeNull();
    expect(orders).toHaveLength(orderList.length);
  });

  it('findOne should return an order by id', async () => {
    const storedOrder: OrderEntity = orderList[0];
    const order: OrderEntity = await service.findOne(storedOrder.id);
    expect(order).not.toBeNull();
    expect(order.amount).toEqual(storedOrder.amount);
    expect(order.date).toEqual(storedOrder.date);
  });

  it('findOne should throw an exception for an invalid order id', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'The order with the given id was not found');
  });

  it('create should return a new order', async () => {
    const order: OrderEntity = {
      id: '',
      amount: faker.number.int({ min: 1, max: 1000 }),
      date: faker.date.future(),
      seller: Object.assign(new UserEntity(), {}),
      buyer: Object.assign(new UserEntity(), {}),
      products: [Object.assign(new ProductEntity(), {})],
    };

    const newOrder: OrderEntity = await service.create(order);
    expect(newOrder).not.toBeNull();

    const storedOrder: OrderEntity = await repository.findOne({ where: { id: newOrder.id } });
    expect(storedOrder).not.toBeNull();
    expect(storedOrder.amount).toEqual(newOrder.amount);
    expect(storedOrder.date).toEqual(newOrder.date);
  });

  it('update should modify an order', async () => {
    const order: OrderEntity = orderList[0];
    order.amount = faker.number.int({ min: 1, max: 1000 });
    order.date = faker.date.recent();

    const updatedOrder: OrderEntity = await service.update(order.id, order);
    expect(updatedOrder).not.toBeNull();

    const storedOrder: OrderEntity = await repository.findOne({ where: { id: order.id } });
    expect(storedOrder).not.toBeNull();
    expect(storedOrder.amount).toEqual(order.amount);
    expect(storedOrder.date).toEqual(order.date);
  });

  it('update should throw an exception for an invalid order id', async () => {
    let order: OrderEntity = orderList[0];
    order = {
      ...order,
      amount: faker.number.int({ min: 1, max: 1000 }),
    }
    await expect(() => service.update("0", order)).rejects.toHaveProperty('message', 'The order with the given id was not found');
  });

  it('delete should remove an order', async () => {
    const order: OrderEntity = orderList[0];
    await service.delete(order.id);
    const deletedOrder: OrderEntity = await repository.findOne({ where: { id: order.id } });
    expect(deletedOrder).toBeNull();
  });

  it('delete should throw an exception for an invalid order id', async () => {
    const order: OrderEntity = orderList[0];
    await service.delete(order.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'The order with the given id was not found');
  });

  const seedDatabase = async () => {
    repository.clear();
    orderList = [];
    for (let i = 0; i < 5; i++) {
      const order: OrderEntity = await repository.save({
        amount: faker.number.int({ min: 1, max: 1000 }),
        date: faker.date.future(),
      })
      orderList.push(order);
    }
  }
});
