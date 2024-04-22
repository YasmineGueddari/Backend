import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategorieDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
