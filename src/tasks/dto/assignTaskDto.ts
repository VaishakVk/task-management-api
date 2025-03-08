import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { MongoObjectId } from 'src/types/objectId';

export class AssignTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId({ message: 'assignedTo should be a valid ID' })
  assignedTo: MongoObjectId;
}
