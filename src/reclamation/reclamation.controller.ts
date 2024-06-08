import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, Put, UseGuards } from '@nestjs/common';
import { CreateReclamationDto } from 'src/common/dtos/create-reclamation.dto'; 
import { UpdateReclamationDto } from 'src/common/dtos/update-reclamation.dto'; 
import { ReclamationsService } from './reclamation.service';
import { ApiTags } from '@nestjs/swagger';




@ApiTags('Backoffice reclamation')
@Controller('reclamation') 

export class ReclamationsController { 
  constructor(private readonly reclamationService: ReclamationsService) {} // 

  @Post() 
  create(@Body() createReclamationDto: CreateReclamationDto) { 
    return this.reclamationService.create(createReclamationDto); 
  }

  @Get() 
  findAll() {
    return this.reclamationService.findAll(); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reclamationService.findOne(+id); 
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() updateReclamationDto: UpdateReclamationDto) { 
    return this.reclamationService.update(+id, updateReclamationDto); 
  }

  @Delete(':id') 
  remove(@Param('id') id: string) {
    return this.reclamationService.remove(+id); 
  }


  @Delete(':id/disable')
  async disableReclamation(@Param('id') id: number) { 
  try {
    await this.reclamationService.disableReclamation(id);
    return { message: 'Reclamation désactivée avec succès' };
  } catch (error) {
    console.error('Erreur lors de la désactivation de la Reclamation :', error);
    throw new InternalServerErrorException('Erreur interne du serveur');
  }
}

  @Put(':id/reactivate')
  async reactivateReclamation(@Param('id') id: number) {
    try{
    await this.reclamationService.reactivateReclamation(id);
    return { message: 'Reclamation  reactivate avec succès' };
  } catch (error) {
    console.error('Erreur lors de la  reactivate de Reclamation :', error);
    throw new InternalServerErrorException('Erreur interne du serveur');
  }
  }

  @Put(':id/confirm')
 async ConfirmReclamation(@Param('id') id: number) {
  try{
  await this.reclamationService.ConfirmReclamation(id);
  return { message: 'Reclamation  Confirm avec succès' };
} catch (error) {
  console.error('Erreur lors de la Confirm de Reclamation :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}

@Put(':id/cancel')
async CancelReclamation(@Param('id') id: number) {
  try{
  await this.reclamationService.CancelReclamation(id);
  return { message: 'Reclamation  Cancel avec succès' };
} catch (error) {
  console.error('Erreur lors de la Cancel de Reclamation :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}

@Put(':id/InProgress')
async InProgressReclamation(@Param('id') id: number) {
  try{
  await this.reclamationService.InProgressReclamation(id);
  return { message: 'Reclamation  Cancel avec succès' };
} catch (error) {
  console.error('Erreur lors de la Cancel de Reclamation :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}
}
