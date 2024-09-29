import { Injectable , BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , Between , MoreThan, Equal} from 'typeorm';
import { Doctor } from '../database/entities/doctors.entity';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { Appointment } from '../database/entities/appointments.entity';
import  * as cron from 'node-cron';
import * as moment from 'moment';
import { Schedule } from '../database/entities/schedules.entity';
@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Schedule)
    private scheduleRepository : Repository<Schedule>,
    @InjectRepository(Appointment)
    private appointmentRepository : Repository<Appointment>
  ) {
      this.scheduleAutoUpdateStatus();
  }

  create(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  findOne(doctor_id: number) {
    return this.doctorRepository.findOne({
      where: { doctor_id },
      relations: ['specialization', 'schedules'],
    });
  }
  
  findAll() {
    return this.doctorRepository.find();
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    await this.doctorRepository.update(id, updateDoctorDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.doctorRepository.delete(id);
  }

//   async getDoctorDetails(doctor_id: number): Promise<Doctor> {
//     // Use TypeORM's `findOne` method to fetch the doctor by ID along with related entities
//     return await this.doctorRepository.findOne({
//       where: { doctor_id },
//       relations: ['specialization', 'schedules'],
//     });
// }

async updateDoctorStatus(doctorId: number, newStatus: string): Promise<Doctor> {
  const doctor = await this.doctorRepository.findOne({ where: { doctor_id: doctorId } });

  if (!doctor) {
    throw new BadRequestException('Doctor not found');
  }

  // Update the doctor's status
  await this.doctorRepository.update(doctorId, {
    status: newStatus,
  });
  const currentDate = new Date  // Get current date as YYYY-MM-DD
  const currentTime = moment().format('HH:mm'); // Converts to a JS Date object for the query

  // Find all future appointments for this doctor
  const futureAppointments = await this.appointmentRepository.find({
    where: {
      doctor: {
       doctor_id: doctorId}
        ,
      appointment_time: MoreThan(currentTime), 
      appointment_date : currentDate// Only get future appointments
    },
  });

  // Bulk update the status of all future appointments
  if (futureAppointments.length > 0) {
    const appointmentIds = futureAppointments.map(appointment => appointment.appointment_id); // Collect all appointment IDs

    // Perform a bulk update query to reschedule all future appointments
    await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: 'rescheduled' }) // or any other appropriate status
      .whereInIds(appointmentIds) // Update only the appointments with the collected IDs
      .execute();
  }
  // Return the updated doctor entity
  return this.doctorRepository.findOne({ where: { doctor_id: doctorId } });
}


// Auto-update doctor status based on first appointment of the day
async markAsInactive(doctorId: number): Promise<Doctor> {
  const doctor = await this.doctorRepository.findOne({ where: { doctor_id: doctorId } });

  if (!doctor) {
    throw new BadRequestException('Doctor not found');
  }

  const today = moment().format('dddd'); // Get the current day of the week, e.g., 'Monday', 'Tuesday'


  // Get doctor's first appointment of the day
  const firstSchedule = await this.scheduleRepository.findOne({
    where: {
      doctor: { doctor_id: doctorId },
      day_of_week: today, // Get today's schedule
    },
    relations: ['doctor'], // Fetch related doctor entity
    order: {
      start_time: 'ASC', // Order by start_time to get the first available schedule
    },
  });
  
  

  if (!firstSchedule) {
    throw new BadRequestException('No appointments found for today');
  }

  // Calculate the time difference between now and the first appointment
  const now = moment();
  const appointmentTime = moment(firstSchedule.start_time);
  const hoursDiff = appointmentTime.diff(now, 'hours');

  // If it's less than or equal to 2 hours before the first appointment, keep the previous status
  if (!(hoursDiff <= 2)) { 
    throw new BadRequestException('you can update the status only after 2 hours'); // Status remains unchanged
  }

  // Otherwise, we can allow status updates
  return await  this.updateDoctorStatus(doctor.doctor_id, 'inactive');
}

// Schedule a cron job that runs every day at midnight to auto-update doctor statuses
 scheduleAutoUpdateStatus() {
  cron.schedule('*/1 * * * *', async () => {
    console.log('Running cron job to update doctor statuses...');

    // Get all doctor IDs with status 'inactive'
    const inactiveDoctors = await this.doctorRepository
      .createQueryBuilder('doctor')
      .select('doctor.doctor_id') // Select only the IDs
      .where('doctor.status = :status', { status: 'inactive' })
      .getMany();

    if (inactiveDoctors.length > 0) {
      // Extract doctor IDs from the result
      const doctorIds = inactiveDoctors.map(doctor => doctor.doctor_id);

      // Bulk update status to 'active'
      await this.doctorRepository
        .createQueryBuilder()
        .update('Doctor')
        .set({ status: 'active' })
        .whereInIds(doctorIds)
        .execute();

      console.log(`Updated ${doctorIds.length} doctors to 'active' status.`);
    } else {
      console.log('No inactive doctors found.');
    }
  });
}


}
