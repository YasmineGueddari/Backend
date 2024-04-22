import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileName = uuidv4() + path.extname(file.originalname);
    const filePath = path.join('uploads', fileName); // Chemin complet du fichier

    try {
      fs.writeFileSync(filePath, file.buffer);
      return fileName; // Retourne uniquement le nom du fichier
    } catch (error) {
      throw new BadRequestException('Failed to save file');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new BadRequestException('Failed to delete file');
    }
  }
}
