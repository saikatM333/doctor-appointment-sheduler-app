import { Injectable ,NotFoundException, ConflictException, BadRequestException, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,  MoreThan,Not } from 'typeorm';
import { Appointment } from '../database/entities/appointments.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { Client } from '../database/entities/clients.entity';
import { Doctor } from '../database/entities/doctors.entity';
import { Room } from '../database/entities/rooms.entity';
import { Schedule } from '../database/entities/schedules.entity';
import { NotificationService } from '../notification/notification.service'; // Import the Notification Service
import { Between } from 'typeorm';
import * as moment from 'moment';
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Schedule)
    private scheduleRepository : Repository<Schedule>,
    private readonly notificationService: NotificationService
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { tenant_id, doctor_id, appointment_date, appointment_time, reason } = createAppointmentDto;
    
      const now = moment.tz("Asia/Kolkata");
      console.log("now", now)
    // Validate Tenant (Patient)
    const tenant = await this.clientRepository.findOne({ where: { tenant_id } });
    if (!tenant) {
        throw new Error('Client not found');
    }
     
    // Validate Doctor
    const doctor = await this.doctorRepository.findOne({ where: { doctor_id } });
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const existingAppointment = await this.appointmentRepository.findOne({
        where: {
            tenant: { email : tenant.email }, // Check by tenant ID or email
            appointment_date: new Date(appointment_date), // Ensure appointment is on the same date
        },
    });

    Logger.log("existingAppointment",existingAppointment);

    if (existingAppointment) {
        throw new Error('You have already booked an appointment on this date.');
    }

    // Parse the appointment date and time
    const appointmentDateTime = moment(`${appointment_date} ${appointment_time}`, 'YYYY-MM-DD HH:mm:ss');

    // Get the day of the week, e.g., "Monday"
    const dayOfWeek = appointmentDateTime.format('dddd');

    // Fetch the doctor's schedules for the specified day of the week
    const doctorSchedules = await this.scheduleRepository.find({
        where: { doctor: { doctor_id }, day_of_week: dayOfWeek }
    });

    // Check if the doctor has any available schedule for the selected day
    if (!doctorSchedules.length) {
        throw new Error(`Doctor is not available on ${dayOfWeek}`);
    }

    // Loop through each schedule to check if the appointment time falls within it
    for (const schedule of doctorSchedules) {
        const scheduleStartTime = moment(`${appointment_date} ${schedule.start_time}`, 'YYYY-MM-DD HH:mm:ss');
        const scheduleEndTime = moment(`${appointment_date} ${schedule.end_time}`, 'YYYY-MM-DD HH:mm:ss');

        // Ensure the appointment is being booked for a future time slot, not a past unbooked time
        if (now.isSameOrAfter(scheduleEndTime)) {
            throw new Error('Cannot book for a time slot that has already passed');
        }

        // Ensure the appointment is being booked at least 24 hours in advance
    const hoursUntilAppointment = scheduleStartTime.diff(now, 'hours');
    // if (hoursUntilAppointment < 24) {
    //     throw new Error('Appointments must be booked at least 24 hours in advance');
    // }
        // Check if the appointment time falls within this schedule's time range
        if (
            appointmentDateTime.isSameOrAfter(scheduleStartTime) && 
            appointmentDateTime.isBefore(scheduleEndTime)
        ) {
            // Check for any conflicting appointment within this schedule on the same date
            const conflictingAppointment = await this.appointmentRepository.findOne({
                where: {
                    doctor: { doctor_id },
                    appointment_date: new Date(appointment_date),
                    appointment_time: Between(schedule.start_time, schedule.end_time), // Check within the schedule time
                },
            });

            if (conflictingAppointment) {
                throw new Error('The doctor already has an appointment within this schedule time slot');
            }

            // If no conflict, proceed to create the appointment
            const appointment = new Appointment();
            appointment.tenant = tenant;
            appointment.doctor = doctor;
            appointment.appointment_date = new Date(appointment_date);
            appointment.appointment_time = appointment_time;
            appointment.reason = reason;
            appointment.status = 'Scheduled';

            // Set reminder time (optional)
            const reminderTime = new Date(appointment.appointment_date);
            reminderTime.setDate(reminderTime.getDate() - 1); // 1 day before
            appointment.reminder_time = reminderTime;

            // Save the appointment
            const savedAppointment = await this.appointmentRepository.save(appointment);

            // Send a notification (optional)
            await this.notificationService.sendCreateNotification(doctor_id, tenant_id, savedAppointment.appointment_id);

            return savedAppointment;
        }
    }

    // If no matching schedule is found for the appointment time
    throw new Error('Appointment time is outside the doctor’s available schedule');
}

    async getAvailableSlotForADay(doctorId: number, date: string, appointmentId?: number): Promise<{ start: string; end: string }[]> {
        const dayOfWeek = moment(date).format('dddd');
        const schedules = await this.scheduleRepository.find({
            where: { doctor: { doctor_id: doctorId }, day_of_week: dayOfWeek },
        });

        if (!schedules.length) {
            throw new BadRequestException(`Doctor is not available on ${dayOfWeek}`);
        }

        const slots = schedules.map(schedule => {

            if(this.checkIfSlotAvailable(doctorId, moment(`${date} ${schedule.start_time}`, 'YYYY-MM-DD HH:mm:ss'), moment(`${date} ${schedule.end_time}`, 'YYYY-MM-DD HH:mm:ss'), appointmentId)){
                const start = moment(`${date} ${schedule.start_time}`, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
                const end = moment(`${date} ${schedule.end_time}`, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
                return { start, end };
            }
        });

        return slots;
    }

    // cond: not slots or day over
    async nextDayAppointmentBook(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        const current = moment.tz("Asia/Kolkata");

        const slots = await this.getAvailableSlotForADay(createAppointmentDto.doctor_id, current.format('YYYY-MM-DD'));

        if (!slots.length || slots[slots.length - 1].end < current.format('HH:mm')) {
            current.add(1, 'days');
        } else {
            throw new BadRequestException('This day have slot avaliable please check that once!');
        }

        const nextDaySlot = await this.getAvailableSlotForADay(createAppointmentDto.doctor_id, current.format('YYYY-MM-DD'));

        if (!nextDaySlot.length) {
            throw new BadRequestException('Doctor is not available for the next day');
        }

        createAppointmentDto.appointment_date = current.format('YYYY-MM-DD');
        createAppointmentDto.appointment_time = nextDaySlot[0].start;

        const appointment = await this.appointmentRepository.save(createAppointmentDto);

        return appointment;
    }



  // Check doctor availability based on schedules
  // private async checkDoctorAvailability(doctor: Doctor, date: string, time: string): Promise<boolean> {
  //   const dayOfWeek = new Date(date).toLocaleString('en-IN', { weekday: 'long' });

  //   // Query the schedules table for the given doctor and day of the week
  //   const schedules = await this.scheduleRepository
  //     .createQueryBuilder('schedule')
  //     .where('schedule.doctorDoctorId = :doctorId', { doctorId: doctor.doctor_id })
  //     .andWhere('schedule.day_of_week = :dayOfWeek', { dayOfWeek })
  //     .getMany();

  //   // Check if the time falls within the doctor's available hours (start_time and end_time)
  //   return schedules.some(schedule => {
  //     const startTimeIST = schedule.start_time;
  //     const endTimeIST = schedule.end_time;

  //     return time >= startTimeIST && time <= endTimeIST;
  //   });
  // }

  // async findOne(appointment_id: number) {
  //   return this.appointmentRepository.findOne({where :{appointment_id},  relations: ['doctor', 'tenant', 'room', 'payments'] });
  // }



  async findAll() {
    return this.appointmentRepository.find();
  }

  // async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   await this.appointmentRepository.update(id, updateAppointmentDto);
  //   return this.findOne(id);
  // }

  async remove(id: number) {
    return this.appointmentRepository.delete(id);
  }

  async getUpcomingAppointmentsForUser(tenantId: number): Promise<Appointment[]> {
    // Get the current date and time to compare with appointment dates
    const currentDate = new Date();

    // Query the appointment repository to find appointments where:
    // - The tenant (client) ID matches
    // - The appointment date is greater than or equal to the current date (upcoming)
    const upcomingAppointments = await this.appointmentRepository.find({
      where: {
        tenant: { tenant_id: tenantId }, // Filter by tenant ID
        appointment_date: MoreThan(currentDate) // Filter by future dates
      },
      relations: ['doctor', 'room'], // Include related entities (doctor and room)
      order: { appointment_date: 'ASC' } // Order by date (ascending)
    });

    return upcomingAppointments;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const { appointment_date, appointment_time } = updateAppointmentDto;

    // Find the existing appointment with related entities
    const appointment = await this.appointmentRepository.findOne({
        where: { appointment_id: id },
        relations: ['doctor', 'tenant'],
    });

    if (!appointment) {
        throw new NotFoundException('Appointment not found');
    }

    // Use the existing doctor from the appointment
    const doctor = appointment.doctor;
    const client = appointment.tenant;

    // Parse the updated appointment date and time
    const newAppointmentDateTime = moment(`${appointment_date || appointment.appointment_date} ${appointment_time || appointment.appointment_time}`, 'YYYY-MM-DD HH:mm:ss');
    const dayOfWeek = newAppointmentDateTime.format('dddd');

    // Fetch the doctor's schedules for the specified day of the week
    const doctorSchedules = await this.scheduleRepository.find({
        where: { doctor: { doctor_id: doctor.doctor_id }, day_of_week: dayOfWeek },
    });

    if (!doctorSchedules.length) {
        throw new ConflictException(`Doctor is not available on ${dayOfWeek}`);
    }

    // Check if the appointment time falls within any of the doctor's schedules
    let isAppointmentValid = false;
    for (const schedule of doctorSchedules) {
        const scheduleStartTime = moment(`${appointment_date || appointment.appointment_date} ${schedule.start_time}`, 'YYYY-MM-DD HH:mm:ss');
        const scheduleEndTime = moment(`${appointment_date || appointment.appointment_date} ${schedule.end_time}`, 'YYYY-MM-DD HH:mm:ss');

        // Check if the appointment time is within this schedule
        if (
            newAppointmentDateTime.isSameOrAfter(scheduleStartTime) &&
            newAppointmentDateTime.isBefore(scheduleEndTime)
        ) {
            // Check for any conflicting appointments within this schedule on the same date
            const conflictingAppointment = await this.appointmentRepository.findOne({
                where: {
                    doctor: { doctor_id: doctor.doctor_id },
                    appointment_date: new Date(appointment_date || appointment.appointment_date),
                    appointment_time: Between(schedule.start_time, schedule.end_time), // Check within the schedule time
                    appointment_id: Not(id), // Exclude the current appointment
                },
            });

            if (conflictingAppointment) {
                throw new ConflictException('The doctor already has another appointment within this schedule time slot');
            }

            // No conflict found, so the appointment can be updated
            isAppointmentValid = true;
            break;
        }
    }

    if (!isAppointmentValid) {
        throw new ConflictException('The appointment time is outside the doctor’s available schedule or conflicts with another appointment');
    }

    // Proceed with updating the appointment
    await this.appointmentRepository.update(id, {
        appointment_date: appointment_date ? new Date(appointment_date) : appointment.appointment_date,
        appointment_time: appointment_time || appointment.appointment_time,
    });

    // Return the updated appointment
    const updatedAppointment = await this.findOne(id);

    // Update reminder time if appointment_date is changed
    if (appointment_date) {
        const reminderTime = new Date(appointment_date);
        reminderTime.setDate(reminderTime.getDate() - 1); // 1 day before

        await this.appointmentRepository.update(id, { reminder_time: reminderTime });
    }

    // Send update notification
    await this.notificationService.sendUpdateNotification(doctor.doctor_id, client.tenant_id, updatedAppointment.appointment_id);

    return updatedAppointment;
}

  

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
      relations: ['doctor', 'room', 'payments', 'prescriptions'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  private async checkIfSlotAvailable(doctorId: number, slotStart: moment.Moment, slotEnd: moment.Moment, appointmentId?: number): Promise<boolean> {
    const appointmentDateStr: string = slotStart.format('YYYY-MM-DD');
    const appointmentDate: Date = new Date(appointmentDateStr);

    // Fetch doctor's schedule for the day
    const dayOfWeek = slotStart.format('dddd'); // Get the day of the week in full name (e.g., 'Monday')
    const schedules = await this.scheduleRepository.find({
        where: {
            doctor: { doctor_id: doctorId },
            day_of_week: dayOfWeek,
        },
    });

    // Check if the slotStart and slotEnd fall within any of the doctor's schedule slots
    const isWithinSchedule = schedules.some(schedule => {
        const scheduleStart = moment(schedule.start_time, 'HH:mm:ss');
        const scheduleEnd = moment(schedule.end_time, 'HH:mm:ss');
        return slotStart.isSameOrAfter(scheduleStart) && slotEnd.isSameOrBefore(scheduleEnd);
    });

    if (!isWithinSchedule) {
        return false; // Slot is not within the schedule range
    }

    // Fetch conflicting appointments
    const conflictingAppointments = await this.appointmentRepository.find({
        where: {
            doctor: { doctor_id: doctorId },
            appointment_date: appointmentDate,
            appointment_time: Between(slotStart.format('HH:mm:ss'), slotEnd.format('HH:mm:ss')),
            appointment_id: appointmentId ? Not(appointmentId) : undefined // Exclude current appointment for updates
        }
    });

    return conflictingAppointments.length === 0;
} 

}


