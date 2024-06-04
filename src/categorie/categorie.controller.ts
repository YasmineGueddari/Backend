import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from 'src/common/dtos/create-categorie.dto';
import { UpdateCategorieDto } from 'src/common/dtos/update-categorie.dto';
import { Categorie } from 'src/enteties/categorie.entity';

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(@Body() createCategorieDto: CreateCategorieDto) {
    return this.categorieService.create(createCategorieDto);
  }

  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategorieDto: UpdateCategorieDto) {
    return this.categorieService.update(+id, updateCategorieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorieService.remove(+id);
  }

  @Delete(':id/disable')
  async disableCategorie(@Param('id') id: number) { 
  try {
    await this.categorieService.disableCategorie(id);
    return { message: 'Categorie désactivée avec succès' };
  } catch (error) {
    console.error('Erreur lors de la désactivation de la Categorie :', error);
    throw new InternalServerErrorException('Erreur interne du serveur');
  }
}


}
