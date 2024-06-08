import { IsString, IsDate, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { Type } from '../enum/type.enum';

export class CreateNotificationDao {
  @IsString()
  type: string;

  @IsEnum({})
  title: Type;

}
