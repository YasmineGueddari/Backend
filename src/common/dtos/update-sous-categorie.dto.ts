import { PartialType } from '@nestjs/mapped-types';
import { CreateSousCategorieDto } from './create-sous-categorie.dto';

export class UpdateSousCategorieDto extends PartialType(CreateSousCategorieDto) {}
