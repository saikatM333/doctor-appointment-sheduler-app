import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) 
{
    tenant_id?: number;
    doctor_id?: number;
    appointment_date?: string;
    appointment_time?: string;
    reason?: string;
    status?: 'Scheduled' | 'Cancelled' | 'Completed';
}
