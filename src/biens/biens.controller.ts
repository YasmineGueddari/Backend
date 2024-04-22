import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BiensService } from './biens.service';
import { CreateBienDto } from 'src/common/dtos/create-bien.dto';
import { UpdateBienDto } from 'src/common/dtos/update-bien.dto';
import { promises } from 'dns';
import { Bien } from 'src/enteties/bien.entity';


@Controller('biens')
export class BiensController {
  constructor(private readonly biensService: BiensService) {}

  @Post()
  create(@Body() createBienDto: CreateBienDto) {
    return this.biensService.create(createBienDto);
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
  update(@Param('id') id: string, @Body() updateBienDto: UpdateBienDto) {
    return this.biensService.update(+id, updateBienDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biensService.remove(+id);
  }
}
