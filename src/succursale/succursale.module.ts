import { Module } from '@nestjs/common';
import { SuccursaleService } from './succursale.service';
import { SuccursaleController } from './succursale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Succursale } from 'src/enteties/succursale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Succursale])],
  controllers: [SuccursaleController],
  providers: [SuccursaleService]
})
export class SuccursaleModule {}
