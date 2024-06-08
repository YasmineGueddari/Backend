import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/enteties/user.entity';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    //console.log('Validating payload:', payload);
    const { email } = payload;
    const user = await this.userRepository.findOne({
      where: { email }
    });
    if (!user) {
      //console.log('User not found with email:', email);
      throw new UnauthorizedException();
    }
    //console.log('User found:', user);
    return user;
  }
}
