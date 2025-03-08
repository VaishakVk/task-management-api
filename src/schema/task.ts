import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TaskPriority } from 'src/enum/priority.enum';
import { TaskStatus } from 'src/enum/taskStatus.enum';
import { MongoObjectId } from 'src/types/objectId';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.PENDING })
  status: string;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: MongoObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignedTo?: MongoObjectId;

  @Prop({ default: false })
  deleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
