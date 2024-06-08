import { Module } from '@nestjs/common';
import { userController } from './user.controller';
import { userService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/enteties/user.entity';
import { FileModule } from 'src/file/file.module';
import { Succursale } from 'src/enteties/succursale.entity';
import * as dotenv from 'dotenv';


dotenv.config();

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([User, Succursale]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2h', // 2 hours
      },
    }),
  ],
  controllers: [userController],
  providers: [
    userService,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class userModule {}
