import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  

})
export class FeedbackModule {}
