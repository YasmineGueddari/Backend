import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../enum/reservation-status.enum';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
 
  @ApiPropertyOptional()
  @IsArray()
  @IsNotEmpty()
  bienIds: number[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date_debut: Date;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date_fin: Date;

 
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ReservationStatus)
  statut?: ReservationStatus;


  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; 
  
}
