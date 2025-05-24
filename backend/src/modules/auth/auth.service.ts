import { Request } from 'express';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserRoles } from '@common/enums';

import { UsersService } from '@modules/users/users.service';

import { SignInDto, RegisterDto } from './dto';
import { NOT_TOKEN } from './constants/auth.constants';

const CREDENTIALS_ERROR = 'Invalid credentials';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersService.getPasswordByEmail(email);
    if (!user) throw new UnauthorizedException(CREDENTIALS_ERROR);

    const match = await this.usersService.validatePassword(password, user.password);
    if (!match) throw new UnauthorizedException(CREDENTIALS_ERROR);

    const payload = { sub: user._id };

    return {
      user: await this.usersService.findByEmail(email),
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.create({
      ...registerDto,
      role: UserRoles.CLIENT,
    });
  }

  extractTokenFromRequest(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException(NOT_TOKEN);

    const [type, token] = authHeader.split(' ');

    if (!type || type !== 'Bearer') {
      throw new UnauthorizedException(NOT_TOKEN);
    }

    if (!token) throw new UnauthorizedException(NOT_TOKEN);

    return token;
  }
}
