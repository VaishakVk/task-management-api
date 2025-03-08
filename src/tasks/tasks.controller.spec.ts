import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import mongoose from 'mongoose';
import { TaskStatus } from 'src/enum/taskStatus.enum';
import { TaskPriority } from 'src/enum/priority.enum';
import { JwtService } from '@nestjs/jwt';

const userId = new mongoose.Schema.ObjectId('user-123');
const taskId = new mongoose.Schema.ObjectId('task-123');
const mockTask = {
  _id: taskId,
  title: 'Test Task',
  description: 'Test Description',
  assignedTo: userId,
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
};
const mockUser = {
  _id: userId,
  name: 'test',
};
const mockTasksService = {
  createTask: jest.fn().mockResolvedValue(mockTask),
  getTaskById: jest.fn().mockResolvedValue(mockTask),
  getTaskByIdWithUser: jest
    .fn()
    .mockResolvedValue({ ...mockTask, createdBy: mockUser }),
  updateTask: jest.fn().mockResolvedValue({ ...mockTask, description: 'test' }),
  deleteTask: jest.fn().mockResolvedValue({ ...mockTask, deleted: true }),
  getTasks: jest.fn().mockResolvedValue([mockTask]),
  assignTask: jest
    .fn()
    .mockResolvedValue({ ...mockTask, assignedTo: mockUser }),
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        JwtService,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const result = await controller.createTask(mockTask, userId);
    expect(result).toEqual(mockTask);
    expect(service.createTask).toHaveBeenCalledWith(mockTask, userId);
  });

  it('should return all tasks', async () => {
    const result = await controller.getTasks({ page: 0, limit: 20 }, userId);
    expect(result).toEqual([mockTask]);
    expect(service.getTasks).toHaveBeenCalled();
  });

  it('should update a task', async () => {
    const result = await controller.updateTask(
      taskId,
      {
        description: 'test',
      },
      userId,
    );
    expect(result?.description).toEqual('test');
    expect(service.updateTask).toHaveBeenCalledWith(
      taskId,
      {
        description: 'test',
      },
      userId,
    );
  });

  it('should delete a task', async () => {
    const result = await controller.deleteTask(taskId, userId);
    expect(result).toEqual({ ...mockTask, deleted: true });
    expect(service.deleteTask).toHaveBeenCalledWith(taskId, userId);
  });
});
