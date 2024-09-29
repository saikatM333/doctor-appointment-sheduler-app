import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SetMetadata('public', true) // Mark the route as public
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
