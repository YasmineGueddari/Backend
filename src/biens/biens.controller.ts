import { Body, Controller, Inject, Post, Get, ValidationPipe, UseInterceptors, UploadedFile, Res, Query, Delete, Param, Patch, ParseIntPipe, InternalServerErrorException, Put, UseGuards } from '@nestjs/common';
import { BiensService } from './biens.service';
import { CreateBienDto } from 'src/common/dtos/create-bien.dto';
import { UpdateBienDto } from 'src/common/dtos/update-bien.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises } from 'dns';
import { Bien } from 'src/enteties/bien.entity';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('Backoffice bien')
@Controller('biens')

export class BiensController {
  constructor(private readonly biensService: BiensService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createBienDto: CreateBienDto,
    @UploadedFile() image: Express.Multer.File, 
  ) {
    return this.biensService.create(createBienDto,image);
  }



  @Get('/pagination') // Déplacer la route getAllBiens au-dessus de findAll
  getAllBiens(@Query('page') page: string = '1', @Query('itemsPerPage') itemsPerPage: string = '10') {
    const parsedPage = parseInt(page, 10);
    const parsedItemsPerPage = parseInt(itemsPerPage, 10);
    
    return this.biensService.getAllBiens(parsedPage, parsedItemsPerPage);
  }


  @Get()
  findAll() {
    return this.biensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biensService.findOne(+id);
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateBienDto: UpdateBienDto,
  ) {
    return this.biensService.update(+id, updateBienDto, image );
  }



    @Delete(':id/disable')
    async disableBien(@Param('id') id: number) { 
    try {
      await this.biensService.disableBien(id);
      return { message: 'Bien désactivée avec succès' };
    } catch (error) {
      console.error('Erreur lors de la désactivation de Bien :', error);
      throw new InternalServerErrorException('Erreur interne du serveur');
    }
  }


  @Put(':id/reactivate')
  async reactivateBien(@Param('id') id: number) {
    try{
    await this.biensService.reactivateBien(id);
    return { message: 'Bien  reactivate avec succès' };
  } catch (error) {
    console.error('Erreur lors de la  reactivate de Bien :', error);
    throw new InternalServerErrorException('Erreur interne du serveur');
  }
}

@Put(':id/broken')
async brokenBien(@Param('id') id: number) {
  try{
  await this.biensService.brokenBien(id);
  return { message: 'Bien  broken avec succès' };
} catch (error) {
  console.error('Erreur lors de la  broken de Bien :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}



@Put(':id/available')
async availableBien(@Param('id') id: number) {
  try{
  await this.biensService.availableBien(id);
  return { message: 'Bien  available avec succès' };
} catch (error) {
  console.error('Erreur lors de la  available de Bien :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}
 


}
