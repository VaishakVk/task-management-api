import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskStatus } from 'src/enum/taskStatus.enum';
import { TaskPriority } from 'src/enum/priority.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetTasksDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(TaskStatus, {
    message: 'Status must be pending, in-progress, or completed',
  })
  status?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(TaskPriority, {
    message: 'Priority must be low, medium, or high',
  })
  priority?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1))
  page: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit: number;
}
