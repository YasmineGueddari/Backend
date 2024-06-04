import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSuccursaleService } from './user-succursale.service';
import { CreateUserSuccursaleDto } from 'src/common/dtos/create-user-succursale.dto';
import { UpdateUserSuccursaleDto } from 'src/common/dtos/update-user-succursale.dto';


@Controller('user-succursale')
export class UserSuccursaleController {
  constructor(private readonly userSuccursaleService: UserSuccursaleService) {}

  @Post()
  create(@Body() createUserSuccursaleDto: CreateUserSuccursaleDto) {
    return this.userSuccursaleService.create(createUserSuccursaleDto);
  }

  @Get()
  findAll() {
    return this.userSuccursaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSuccursaleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSuccursaleDto: UpdateUserSuccursaleDto) {
    return this.userSuccursaleService.update(+id, updateUserSuccursaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSuccursaleService.remove(+id);
  }
}
