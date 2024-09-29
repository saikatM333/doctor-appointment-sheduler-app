import { Controller, Get, Param , Query} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Appointment } from '../database/entities/appointments.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse,ApiParam , ApiQuery} from '@nestjs/swagger';

@ApiTags('Schedules') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}



  @Get('next-available-slot/:doctorId')
  @ApiOperation({ summary: 'Get next available slot for a specific doctor' })
  @ApiParam({ name: 'doctorId', type: 'number', description: 'ID of the doctor' })
  @ApiResponse({
    status: 200,
    description: 'Returns the next available appointment slot for the doctor',
    schema: {
      example: {
        start_time: '09:00:00',
        end_time: '09:30:00',
        day_of_week: 'Monday',
        start_datetime: '2024-10-01 09:00:00',
        end_datetime: '2024-10-01 09:30:00'
      }
    }
  })
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
  async getNextAvailableSlot(@Param('doctorId') doctorId: number): Promise<Appointment> {
    return this.schedulesService.getNextAvailableSlot(doctorId);
  }
  @Get('next-week/:doctorId')
  @ApiOperation({ summary: 'Get available slots for the next week for a specific doctor' })
  @ApiParam({ name: 'doctorId', type: 'number', description: 'ID of the doctor' })
  @ApiResponse({
    status: 200,
    description: 'Returns available appointment slots for the next week for the doctor',
    schema: {
      example: [
        {
          start_time: '09:00:00',
          end_time: '09:30:00',
          day_of_week: 'Monday',
          start_datetime: '2024-10-01 09:00:00',
          end_datetime: '2024-10-01 09:30:00'
        },
        {
          start_time: '10:00:00',
          end_time: '10:30:00',
          day_of_week: 'Tuesday',
          start_datetime: '2024-10-02 10:00:00',
          end_datetime: '2024-10-02 10:30:00'
        }
      ]
    }
  })
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
  async getNextWeekSlots(@Param('doctorId') doctorId: number) {
    return this.schedulesService.getNextWeekAvailableSlots(doctorId);
  }

  // Get available slots for the current month from the current date
  @Get('current-month/:doctorId')
  @ApiOperation({ summary: 'Get available slots for the current month from the current date' })
  @ApiParam({ name: 'doctorId', type: 'number', description: 'ID of the doctor' })
  @ApiResponse({
    status: 200,
    description: 'Returns available appointment slots for the current month starting from today',
    schema: {
      example: [
        {
          start_time: '09:00:00',
          end_time: '09:30:00',
          day_of_week: 'Monday',
          start_datetime: '2024-09-08 09:00:00',
          end_datetime: '2024-09-08 09:30:00'
        },
        {
          start_time: '10:00:00',
          end_time: '10:30:00',
          day_of_week: 'Wednesday',
          start_datetime: '2024-09-10 10:00:00',
          end_datetime: '2024-09-10 10:30:00'
        }
      ]
    }
  })
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
  async getCurrentMonthSlots(@Param('doctorId') doctorId: number) {
    return this.schedulesService.getCurrentMonthAvailableSlots(doctorId);
  }

  // Get available slots for upcoming months (default is next 2 months)
  @Get('upcoming-months/:doctorId')
  @ApiOperation({ summary: 'Get available slots for upcoming months (default next 2 months)' })
  @ApiParam({ name: 'doctorId', type: 'number', description: 'ID of the doctor' })
  @ApiQuery({
    name: 'monthsAhead',
    required: false,
    type: 'number',
    description: 'Number of months ahead to fetch slots for (default is 2 months)'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns available appointment slots for the upcoming months for the doctor',
    schema: {
      example: [
        {
          start_time: '09:00:00',
          end_time: '09:30:00',
          day_of_week: 'Monday',
          start_datetime: '2024-10-01 09:00:00',
          end_datetime: '2024-10-01 09:30:00'
        },
        {
          start_time: '11:00:00',
          end_time: '11:30:00',
          day_of_week: 'Friday',
          start_datetime: '2024-11-02 11:00:00',
          end_datetime: '2024-11-02 11:30:00'
        }
      ]
    }
  })
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
  async getAvailableSlotsForUpcomingMonths(
    @Param('doctorId') doctorId: number,
    @Query('monthsAhead') monthsAhead: number
  ) {
    return this.schedulesService.getAvailableSlotsForUpcomingMonths(doctorId, monthsAhead);
  }
}