import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { SuccursaleService } from './succursale.service';
import { CreateSuccursaleDto } from 'src/common/dtos/create-succursale.dto';
import { UpdateSuccursaleDto } from 'src/common/dtos/update-succursale.dto';


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

}
