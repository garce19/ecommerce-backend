import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity/user.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UserType } from '../shared/enums';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let userList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(userList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = userList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name);
    expect(user.email).toEqual(storedUser.email);
    expect(user.phone).toEqual(storedUser.phone);
    expect(user.country).toEqual(storedUser.country);
    expect(user.city).toEqual(storedUser.city);
    expect(user.address).toEqual(storedUser.address);
    expect(user.birthdate).toEqual(storedUser.birthdate);
    expect(user.type).toEqual(storedUser.type);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: "",
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      country: faker.location.country(),
      city: faker.location.city(),
      address: faker.location.streetAddress(),
      birthdate: faker.date.birthdate(),
      type: UserType.USER,
      sellerOrders: [],
      buyerOrders: [],
      products: [],
      shoppingBag: null
    };

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne(
      { where: { id: newUser.id}}
    )

    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(newUser.name);
    expect(storedUser.email).toEqual(newUser.email);
    expect(storedUser.password).toEqual(newUser.password);
    expect(storedUser.phone).toEqual(newUser.phone);
    expect(storedUser.country).toEqual(newUser.country);
    expect(storedUser.city).toEqual(newUser.city);
    expect(storedUser.address).toEqual(newUser.address);
    expect(storedUser.birthdate).toEqual(newUser.birthdate);
    expect(storedUser.type).toEqual(newUser.type);
  });

  it('update should modify a user', async () => {
    const user: UserEntity = userList[0];
    user.name = "New name";
    user.email = "New email";

    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();
    const storedUser: UserEntity = await repository.findOne({ where: { id: user.id } });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(user.name);
    expect(storedUser.email).toEqual(user.email);
  });

  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = userList[0];
    user = {
      ...user,
      name: "New name",
      email: "New email"
    }
    await expect(() => service.update("0", user)).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('delete should remove a user', async () => {
    const user: UserEntity = userList[0];
    await service.delete(user.id);
    const deletedUser: UserEntity = await repository.findOne({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  const seedDatabase = async () => {
    repository.clear();
    userList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        country: faker.location.country(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        birthdate: faker.date.birthdate(),
        type: UserType.USER
      })
      userList.push(user);
    }
  }
});
