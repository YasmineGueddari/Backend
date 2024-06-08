import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      const decodedToken = this.jwtService.decode(token) as any;
      const currentDate = new Date();
      //console.log('Token Expiration Time (UTC):', new Date(decodedToken.exp * 1000).toISOString());
      //console.log('Current Time (UTC):', currentDate.toISOString());

      if (currentDate.getTime() > decodedToken.exp * 1000) {
        throw new UnauthorizedException('Token has expired');
      }
    }
    return (await super.canActivate(context)) as boolean;
  }

  //handleRequest(err, user, info) {
    //console.log('JwtAuthGuard - handleRequest called', { err, user, info });
    //if (err || !user) {
      //throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    //}
    //return user;
  //}
}
