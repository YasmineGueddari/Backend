import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSousCategorieDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  categorieId: number;
}
