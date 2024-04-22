import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartementService } from './departement.service';
import { CreateDepartementDto } from 'src/common/dtos/create-departement.dto';
import { UpdateDepartementDto } from 'src/common/dtos/update-departement.dto';
import { promises } from 'dns';
import { Departement } from 'src/enteties/departement.entity';


@Controller('departement')
export class DepartementController {
  constructor(private readonly departementService: DepartementService) {}

  @Post()
  create(@Body() createDepartementDto: CreateDepartementDto) {
    return this.departementService.create(createDepartementDto);
  }

  @Get()
  findAll() {
    return this.departementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartementDto: UpdateDepartementDto) {
    return this.departementService.update(+id, updateDepartementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departementService.remove(+id);
  }
}
