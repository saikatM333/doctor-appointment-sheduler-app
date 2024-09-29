import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse , ApiParam} from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
@ApiTags('feedback') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post(':clientId/:doctorId')
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication token is missing or invalid',
    schema: {
      example: {
        code: 401,
        timestamp: '2024-09-29T04:04:53.034Z',
        message: 'Unauthorized',
      }
    }
  })
  async createFeedback(
    @Param('clientId') clientId: number,
    @Param('doctorId') doctorId: number,
    @Body() createFeedbackDto: CreateFeedbackDto
  ) {
    return this.feedbackService.createFeedback(clientId, doctorId, createFeedbackDto);
  }

  @Get('doctor/:doctorId')
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication token is missing or invalid',
    schema: {
      example: {
        code: 401,
        timestamp: '2024-09-29T04:04:53.034Z',
        message: 'Unauthorized',
      }
    }
  })
  async getFeedbackByDoctor(@Param('doctorId') doctorId: number) {
    return this.feedbackService.getFeedbackByDoctor(doctorId);
  }
}
