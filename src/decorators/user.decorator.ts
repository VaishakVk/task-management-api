import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MongoObjectId } from 'src/types/objectId';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId as MongoObjectId;
  },
);
