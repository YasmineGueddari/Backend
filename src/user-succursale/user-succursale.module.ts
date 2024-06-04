import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSuccursaleService } from './user-succursale.service';
import { UserSuccursaleController } from './user-succursale.controller';
import { UserSuccursale } from 'src/enteties/user-succursale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSuccursale])],
  controllers: [UserSuccursaleController],
  providers: [UserSuccursaleService],
})
export class UserSuccursaleModule {}
