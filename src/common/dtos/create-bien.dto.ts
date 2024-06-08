import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBienDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  statut: boolean; 

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; 

  @IsNotEmpty()
  @IsBoolean()
  requiresConfirmation: boolean; 

  @IsNumber()
  departementId: number;

  @IsNumber()
  categorieId: number;

  @IsNumber()
  sousCategorieId: number;
}
