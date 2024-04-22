import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  date_debut: Date;

  @IsNotEmpty()
  @IsDateString()
  date_fin: Date;

  @IsNotEmpty()
  @IsString()
  statut: string;
}
