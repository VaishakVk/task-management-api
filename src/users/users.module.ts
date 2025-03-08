import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';

@Module({
  exports: [UsersService],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
  ],
})
export class UsersModule {}
