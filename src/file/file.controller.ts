import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Backoffice files')
@Controller('files')

export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const filePath = await this.fileService.saveFile(file);
      return { message: 'File uploaded successfully', filePath };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
