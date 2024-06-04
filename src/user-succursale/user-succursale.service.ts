import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CreateUserSuccursaleDto } from 'src/common/dtos/create-user-succursale.dto';
import { UpdateUserSuccursaleDto } from 'src/common/dtos/update-user-succursale.dto';
import { UserSuccursale } from 'src/enteties/user-succursale.entity';
import { DeepPartial, Repository } from 'typeorm';


@Injectable()
export class UserSuccursaleService {
  constructor(
    @InjectRepository(UserSuccursale)
    private readonly userSuccursaleRepository: Repository<UserSuccursale>,
  ) {}

  
  async create(createUserSuccursaleDto: CreateUserSuccursaleDto) {
    const userSuccursale = plainToClass(UserSuccursale, createUserSuccursaleDto);
    return await this.userSuccursaleRepository.save(userSuccursale);
  }


  async findAll() {
    return await this.userSuccursaleRepository.find();
  }

  async findOne(id: number) {
    return await this.userSuccursaleRepository.findOne({ where: { id } }) ;
  }

  async update(id: number, updateUserSuccursaleDto: UpdateUserSuccursaleDto) {
    const userSuccursale = await this.findOne(id);
    if (!userSuccursale) {
      throw new NotFoundException();
    }
    Object.assign(userSuccursale, updateUserSuccursaleDto);
    return await this.userSuccursaleRepository.save(userSuccursale);
  }

  async remove(id: number) {
    const userSuccursale = await this.findOne(id);
    if (!userSuccursale) {
      throw new NotFoundException();
    }
    return await this.userSuccursaleRepository.remove(userSuccursale);
  }
}
