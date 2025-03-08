import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { TaskPriority } from 'src/enum/priority.enum';
import { MongoObjectId } from 'src/types/objectId';

export class UpdateTaskDto {
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(TaskPriority, {
    message: 'Priority must be low, medium, or high',
  })
  priority?: TaskPriority;

  @IsOptional()
  @ApiProperty()
  @IsMongoId({ message: 'assignedTo should be a valid ID' })
  assignedTo?: MongoObjectId;
}
