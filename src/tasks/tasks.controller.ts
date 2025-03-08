import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetTasksDto } from './dto/getTasks.dto';
import { UserId } from 'src/decorators/user.decorator';
import { MongoObjectId } from 'src/types/objectId';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { AssignTaskDto } from './dto/assignTaskDto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filters: GetTasksDto,
    @UserId() userId: MongoObjectId,
  ) {
    return this.taskService.getTasks(filters, userId);
  }

  @Post()
  @HttpCode(201)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @UserId() userId: MongoObjectId,
  ) {
    return this.taskService.createTask(createTaskDto, userId);
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: MongoObjectId,
    @UserId() userId: MongoObjectId,
  ) {
    return this.taskService.getTaskByIdWithUser(id, userId);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: MongoObjectId,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserId() userId: MongoObjectId,
  ) {
    return this.taskService.updateTask(id, updateTaskDto, userId);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') id: MongoObjectId,
    @UserId() userId: MongoObjectId,
  ) {
    return this.taskService.deleteTask(id, userId);
  }

  @Patch(':id/assign')
  async assignTask(
    @Param('id') id: MongoObjectId,
    @Body() assignTaskDto: AssignTaskDto,
    @UserId() userId: MongoObjectId,
  ) {
    return this.taskService.assignTask(id, assignTaskDto.assignedTo, userId);
  }
}
