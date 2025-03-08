import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MongoObjectId } from 'src/types/objectId';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(userData: SignupDto) {
    const existingUserData = await this.getUserDataByEmail(userData.email);
    if (existingUserData) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userModel.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
    });
    return { _id: user._id };
  }

  async login(userData: LoginDto) {
    const { email, password } = userData;
    const user = await this.getUserDataByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordVaid = await bcrypt.compare(password, user.password);
    if (!isPasswordVaid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.generateAccessCode(user);
    return { accessToken };
  }

  async generateAccessCode(userData: UserDocument) {
    const { email, _id } = userData;
    return this.jwtService.sign(
      { email, _id },
      { secret: process.env.JWT_SECRET },
    );
  }

  async getUserDataByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getUserDataOrThrow(id: MongoObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
