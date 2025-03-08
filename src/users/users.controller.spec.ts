import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import mongoose from 'mongoose';

const userId = new mongoose.Schema.ObjectId('user-123');

const mockUserService = {
  signup: jest.fn().mockResolvedValue({ _id: userId }),
  login: jest.fn().mockResolvedValue({ accessToken: 'test' }),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: UsersService, useValue: mockUserService },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
