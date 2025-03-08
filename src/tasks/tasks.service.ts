import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/schema/task';
import { CreateTaskDto } from './dto/createTask.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { GetTasksDto } from './dto/getTasks.dto';
import { MongoObjectId } from 'src/types/objectId';

@Injectable()
export class TasksService {
  constructor(
    private readonly userService: UsersService,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: MongoObjectId) {
    if (createTaskDto.assignedTo) {
      await this.userService.getUserDataOrThrow(createTaskDto.assignedTo);
    }
    const newTask = new this.taskModel({ ...createTaskDto, createdBy: userId });
    return newTask.save();
  }

  async getTaskById(taskId: MongoObjectId, userId: MongoObjectId) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      createdBy: userId,
      deleted: false,
    });
    return task;
  }

  async getTaskByIdWithUser(taskId: MongoObjectId, userId: MongoObjectId) {
    const task = await this.taskModel
      .findOne({ _id: taskId, createdBy: userId, deleted: false })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .exec();

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async getTasks(filters: GetTasksDto, userId: MongoObjectId) {
    const { page, limit, ...rest } = filters;
    const tasks = await this.taskModel
      .find({ createdBy: userId, deleted: false, ...rest })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', '_id name email')
      .populate('assignedTo', '_id name email')
      .exec();

    return tasks;
  }

  async updateTask(
    taskId: MongoObjectId,
    updateTaskDto: UpdateTaskDto,
    userId: MongoObjectId,
  ) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    });
    if (!task) throw new NotFoundException('Task not found');
    const updatedTask = { ...task.toJSON(), ...updateTaskDto };
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $set: updatedTask },
      { new: true },
    );
  }

  async deleteTask(taskId: MongoObjectId, userId: MongoObjectId) {
    const task = await this.getTaskById(taskId, userId);
    if (!task) throw new NotFoundException('Task not found');
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $set: { deleted: true } },
      { new: true },
    );
  }

  async assignTask(
    taskId: MongoObjectId,
    assignedTo: MongoObjectId,
    userId: MongoObjectId,
  ) {
    const task = await this.getTaskById(taskId, userId);
    if (!task) throw new NotFoundException('Task not found');

    await this.userService.getUserDataOrThrow(assignedTo);

    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $set: { assignedTo: userId } },
      { new: true },
    );
  }
}
