import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSuccursaleDto } from './create-user-succursale.dto';


export class UpdateUserSuccursaleDto extends PartialType(CreateUserSuccursaleDto) {}
