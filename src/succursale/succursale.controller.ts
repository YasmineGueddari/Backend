import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { SuccursaleService } from './succursale.service';
import { CreateSuccursaleDto } from 'src/common/dtos/create-succursale.dto';
import { UpdateSuccursaleDto } from 'src/common/dtos/update-succursale.dto';
import { RolesGuard } from 'src/common/guards/rolesGuard.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('Backoffice succursale')
@Controller('succursale')

export class SuccursaleController {
  constructor(private readonly succursaleService: SuccursaleService) {}

  @Post()
  create(@Body() createSuccursaleDto: CreateSuccursaleDto) {
    return this.succursaleService.create(createSuccursaleDto);
  }

  @Get()
  findAll() {
    return this.succursaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.succursaleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuccursaleDto: UpdateSuccursaleDto) {
    return this.succursaleService.update(+id, updateSuccursaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.succursaleService.remove(+id);

  }

  @Delete(':id/disable')
  async disableSuccursale(@Param('id') id: number) { 
  try {
    await this.succursaleService.disableSuccursale(id);
    return { message: 'Succursale désactivée avec succès' };
  } catch (error) {
    console.error('Erreur lors de la désactivation de la Succursale :', error);
    throw new InternalServerErrorException('Erreur interne du serveur');
  }
}

@Put(':id/reactivate')
async reactivateSuccursale(@Param('id') id: number) {
  try{
  await this.succursaleService.reactivateSuccursale(id);
  return { message: 'Succursale  reactivate avec succès' };
} catch (error) {
  console.error('Erreur lors de la  reactivate de Succursale :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}

}
