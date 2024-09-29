import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../database/entities/appointments.entity';
import { Schedule } from '../database/entities/schedules.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>
  ) {}

  private dayOfWeekMap = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };

  /**
   * Get the next available slot for the doctor within the current week.
   */
  async getNextAvailableSlot(doctorId: number): Promise<any> {
    const now = moment().tz('Asia/Kolkata'); // Current time in India timezone
    const weekEnd = moment().tz('Asia/Kolkata').endOf('week'); // End of the current week

    return this.getAvailableSlotsInRange(doctorId, now, weekEnd, true);
  }

  /**
   * Get available slots for the next week.
   */
  async getNextWeekAvailableSlots(doctorId: number): Promise<any[]> {
    const nextWeekStart = moment().tz('Asia/Kolkata').add(1, 'weeks').isoWeekday(1).startOf('day');
    const nextWeekEnd = moment().tz('Asia/Kolkata').add(1, 'weeks').isoWeekday(7).endOf('day');
    return this.getAvailableSlotsInRange(doctorId, nextWeekStart, nextWeekEnd);
  }

  async getCurrentMonthAvailableSlots(doctorId: number): Promise<any[]> {
    const now = moment().tz('Asia/Kolkata'); // Current time in India timezone
    const monthEnd = moment().tz('Asia/Kolkata').endOf('month'); // End of the current month

    return this.getAvailableSlotsInRange(doctorId, now, monthEnd);
  }

  // Get available slots for upcoming months (e.g., till next month or a few months ahead)
  async getAvailableSlotsForUpcomingMonths(doctorId: number, monthsAhead: number = 2): Promise<any[]> {
    const now = moment().tz('Asia/Kolkata');
    const futureEnd = moment().tz('Asia/Kolkata').add(monthsAhead, 'months').endOf('month');

    return this.getAvailableSlotsInRange(doctorId, now, futureEnd);
  }
  /**
   * Centralized function to retrieve available slots within a given date range.
   * Optionally, it can return only the first available slot if `findFirst` is true.
   */

  private async getAvailableSlotsInRange(
    doctorId: number,
    startDate: moment.Moment,
    endDate: moment.Moment,
    findFirst = false
  ): Promise<any[]> {
    const schedules = await this.scheduleRepository.find({
      where: { doctor: { doctor_id: doctorId } }
    });

    if (schedules.length === 0) {
      throw new BadRequestException('No schedules found for the specified doctor.');
    }

    // Sort schedules by day of the week and start time
    schedules.sort((a, b) => this.sortSchedulesByDayAndTime(a, b));

    const availableSlots = [];

    // Iterate over each schedule
    for (const schedule of schedules) {
      const dayIndex = this.dayOfWeekMap[schedule.day_of_week];
      const scheduleStartTime = moment.tz(schedule.start_time, 'HH:mm:ss', 'Asia/Kolkata');
      const scheduleEndTime = moment.tz(schedule.end_time, 'HH:mm:ss', 'Asia/Kolkata');

      let currentDay = startDate.clone().startOf('day');

      // Iterate over each day within the range and check if it matches the schedule day
      while (currentDay.isBefore(endDate)) {
        if (currentDay.day() === dayIndex) {
          const slotStart = this.generateSlotTime(currentDay, scheduleStartTime);
          const slotEnd = this.generateSlotTime(currentDay, scheduleEndTime);

          // Ensure the slot is within the valid date range
          if (slotStart.isBetween(startDate, endDate, null, '[)')) {
            const isSlotAvailable = await this.checkIfSlotAvailable(doctorId, slotStart, slotEnd);

            if (isSlotAvailable) {
              const slot = this.formatAvailableSlot(schedule, slotStart, slotEnd);
              availableSlots.push(slot);

              if (findFirst) {
                return [slot]; // Return the first available slot if required
              }
            }
          }
        }
        currentDay.add(1, 'days'); // Move to the next day
      }
    }
    
    // Sort the available slots by start datetime for better clarity
    availableSlots.sort((a, b) => {
      return moment(a.start_datetime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.start_datetime, 'YYYY-MM-DD HH:mm:ss'));
    });

    return availableSlots.length ? availableSlots : null;
  }

  /**
   * Helper function to check if a full slot (as provided by the doctor) is available.
   */
  private async checkIfSlotAvailable(doctorId: number, slotStart: moment.Moment, slotEnd: moment.Moment): Promise<boolean> {
    const appointmentDateStr: string = slotStart.format('YYYY-MM-DD');
  const appointmentDate: Date = new Date(appointmentDateStr);
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { doctor_id: doctorId },
        appointment_date: appointmentDate,
        appointment_time: Between(slotStart.format('HH:mm:ss'), slotEnd.format('HH:mm:ss'))
      }
    });
    return appointments.length === 0;
  }

  /**
   * Helper function to generate slot time based on the day and schedule time.
   */
  private generateSlotTime(day: moment.Moment, time: moment.Moment): moment.Moment {
    return day.clone().set({
      hour: time.hour(),
      minute: time.minute(),
      second: time.second()
    });
  }

  /**
   * Helper function to sort schedules by day of the week and then by start time.
   */
  private sortSchedulesByDayAndTime(a: Schedule, b: Schedule): number {
    const dayComparison = this.dayOfWeekMap[a.day_of_week] - this.dayOfWeekMap[b.day_of_week];
    if (dayComparison !== 0) return dayComparison;
    return moment(a.start_time, 'HH:mm:ss').isAfter(moment(b.start_time, 'HH:mm:ss')) ? 1 : -1;
  }

  /**
   * Helper function to format an available slot into the required output structure.
   */
  private formatAvailableSlot(schedule: Schedule, slotStart: moment.Moment, slotEnd: moment.Moment): any {
    return {
      start_time: slotStart.format('HH:mm:ss'),
      end_time: slotEnd.format('HH:mm:ss'),
      day_of_week: schedule.day_of_week,
      start_datetime: slotStart.format('YYYY-MM-DD HH:mm:ss'),
      end_datetime: slotEnd.format('YYYY-MM-DD HH:mm:ss')
    };
  }
}
