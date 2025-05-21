import { Injectable } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class AppService {
  getHello(): string {
    log('Baza toxtab qolmasligi uchun har 12 daqiqada so\'rov yuboriladi')
    return 'Baza toxtab qolmasligi uchun har 12 daqiqada so\'rov yuboriladi';
  }
}
