import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  // Har 12 daqiqada HTTP GET yuboradi
  @Cron('0 */12 * * * *') // "har 12 daqiqada" ifodasi
  async handleCron() {
    const url = `${this.config.get('HOST_URL')}/api`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      console.log('So‘rov yuborildi:', response.status);
    } catch (error) {
      console.error('Xatolik:', error.message);
    }
  }
}
