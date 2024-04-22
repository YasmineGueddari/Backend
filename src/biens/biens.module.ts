import { Module } from '@nestjs/common';
import { BiensService } from './biens.service';
import { BiensController } from './biens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bien } from 'src/enteties/bien.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Bien])],
  controllers: [BiensController],
  providers: [BiensService],
})
export class BiensModule {}
