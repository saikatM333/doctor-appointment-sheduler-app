import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../database/entities/clients.entity';

import { RegisterDto } from '../auth/dtos/register.dto';
import { LoginDto } from '../auth/dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async register(registerClientDto: RegisterDto): Promise<Client> {
    const { first_name, last_name, email, phone, birthdate, gender, address, password } = registerClientDto;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = this.clientRepository.create({
      first_name,
      last_name,
      email,
      phone,
      birthdate: new Date(birthdate),
      gender,
      address,
      password: hashedPassword,
    });

    return this.clientRepository.save(client);
  }

  async validateClient(loginDto: LoginDto): Promise<Client | null> {
    const { email, password } = loginDto;
    const client = await this.clientRepository.findOne({ where: { email } });

    if (client && bcrypt.compareSync(password, client.password)) {
      return client;
    }
    return null;
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      relations: ['appointments', 'medical_records', 'payments', 'subscriptions'],
    });
  }

  async findOne(id: number): Promise<Client> {
    return this.clientRepository.findOne({
      where: { tenant_id: id },
      relations: ['appointments', 'medical_records', 'payments', 'subscriptions'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
