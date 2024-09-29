import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    
    DatabaseModule,  
    ClientsModule,  // Import ClientsModule
  ],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService]
})
export class ClientsModule {}
