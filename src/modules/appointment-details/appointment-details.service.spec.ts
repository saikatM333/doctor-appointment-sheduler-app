import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentDetailsService } from './appointment-details.service';

describe('AppointmentDetailsService', () => {
  let service: AppointmentDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentDetailsService],
    }).compile();

    service = module.get<AppointmentDetailsService>(AppointmentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
