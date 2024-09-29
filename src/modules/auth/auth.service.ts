import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from '../users/schemas/user.entity';
import {ClientsService} from '../clients/clients.service'
import { Client } from '../database/entities/clients.entity';
import { last } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly userService: UsersService,
    private readonly clientService : ClientsService
  ) { }

  async register(registerDto: RegisterDto): Promise<Client> {
    const newUser = await this.clientService.register(registerDto);
    return newUser;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.clientService.validateClient(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { firstname: user.first_name, lastname : user.last_name, sub: user.tenant_id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
