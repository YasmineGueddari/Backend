import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDepartementDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; // Assurez-vous que la propriété isActive est obligatoire et de type boolean

  @IsNumber()
  succursaleId: number;
}
