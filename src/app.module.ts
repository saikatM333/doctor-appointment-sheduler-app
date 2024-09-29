import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';
import { LoggerModule } from 'nestjs-rollbar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './configs';
// import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
// import { DoctorsModule } from './modules/doctors/doctors.module';
// import { AppointmentsModule } from './modules/appointments/appointments.module';
// import { PatientModule } from './modules/patient/patient.module';

// import { DoctorAuthModule } from './modules/doctor-auth/doctor-auth.module';
// import { PatientAuthModule } from './modules/patient-auth/patient-auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { FamilyMemberModule } from './modules/family-member/family-member.module';
import { AppointmentDetailsModule } from './modules/appointment-details/appointment-details.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReminderModule } from './modules/reminder/reminder.module';
// import { ClerkAuthModule } from './modules/clerk-auth/clerk-auth.module';
// import { RolesGuard } from './modules/clerk-auth/role.guard';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accessToken: configService.get('rollbar.accessToken'),
        environment: configService.get('rollbar.environment'),
        captureUncaught: true,
        captureUnhandledRejections: true,
        ignoreDuplicateErrors: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    // UsersModule,
    // DoctorsModule,
    // AppointmentsModule,
    // PatientModule,
    // DoctorAuthModule,
    // PatientAuthModule,
    DatabaseModule,
    AppointmentsModule,
    ClientsModule,
    DoctorsModule,
    SchedulesModule,
    FamilyMemberModule,
    AppointmentDetailsModule,
    NotificationModule,
    ReminderModule,
    // ClerkAuthModule,
    FeedbackModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
