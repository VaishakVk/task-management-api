import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { TaskPriority } from 'src/enum/priority.enum';
import { Task } from 'src/schema/task';
import { MongoObjectId } from 'src/types/objectId';

export class CreateTaskDto implements Partial<Task> {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(TaskPriority, {
    message: 'Priority must be low, medium, or high',
  })
  priority: TaskPriority;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsMongoId({ message: 'assignedTo should be a valid ID' })
  assignedTo?: MongoObjectId;
}
