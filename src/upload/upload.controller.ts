import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';

@Controller('upload')
export class UploadController {
  @Post('file')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './downloads', // Fayllar shu papkaga saqlanadi
      filename: (req, file, callback) => {
        const ext = extname(file.originalname);
          const uniqueName = uuidv4() + ext;
          callback(null, uniqueName);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    log(file);
    return {
      message: 'Fayl muvaffaqiyatli yuklandi!',
      filePath: file.path,
    };
  }
}
