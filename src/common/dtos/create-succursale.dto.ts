import { IsNotEmpty, IsEmail, IsBoolean } from 'class-validator';

export class CreateSuccursaleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; // Assurez-vous que la propriété isActive est obligatoire et de type boolean
}
