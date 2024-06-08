// create-reclamation.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ReclamationStatus } from '../enum/reclamation-status.enum';

export class CreateReclamationDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; 

  @IsNotEmpty()
  statut: ReclamationStatus;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  reservationId: number;

  @IsNotEmpty()
  @IsNumber()
  bienId: number;

 
}
