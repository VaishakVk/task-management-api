import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signup(@Body() signupData: SignupDto) {
    return this.userService.signup(signupData);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginDto) {
    return this.userService.login(loginData);
  }
}
