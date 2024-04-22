import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SousCategorieService } from './sousCategorie.service'; 
import { CreateSousCategorieDto } from 'src/common/dtos/create-sous-categorie.dto'; 
import { UpdateSousCategorieDto } from 'src/common/dtos/update-sous-categorie.dto'; 
import { SousCategorie } from 'src/enteties/sous-categorie.entity'; 
@Controller('sousCategorie')
export class SousCategorieController {
  constructor(private readonly sousCategorieService: SousCategorieService) {}

  @Post()
  create(@Body() createSousCategorieDto: CreateSousCategorieDto) {
    return this.sousCategorieService.create(createSousCategorieDto);
  }
 

  @Get()
  findAll() {
    return this.sousCategorieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sousCategorieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSousCategorieDto: UpdateSousCategorieDto) {
    return this.sousCategorieService.update(+id, updateSousCategorieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sousCategorieService.remove(+id);
  }
}
