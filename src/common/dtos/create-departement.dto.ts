import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartementDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
