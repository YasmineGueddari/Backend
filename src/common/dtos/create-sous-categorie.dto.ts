import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSousCategorieDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  categorieId: number;
}
