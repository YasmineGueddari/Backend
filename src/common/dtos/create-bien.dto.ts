import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBienDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  statut: string;

  @IsNumber()
  departementId: number;

  @IsNumber()
  categorieId: number;

  @IsNumber()
  sousCategorieId: number;
}
