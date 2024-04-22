import { Module } from '@nestjs/common';
import { DepartementService } from './departement.service';
import { DepartementController } from './departement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departement } from 'src/enteties/departement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departement])],
  controllers: [DepartementController],
  providers: [DepartementService],
})
export class DepartementModule {}
