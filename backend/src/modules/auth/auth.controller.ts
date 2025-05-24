import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { Public } from '@common/decorators';

import { SignInDto, RegisterDto } from './dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
