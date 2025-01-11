import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  //Documentación para guard sacada de https://docs.nestjs.com/security/authentication#implementing-the-authentication-guard
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    //console.log({request})
    //console.log({token})

    if (!token) {
      throw new UnauthorizedException('Debe iniciar sesión');
    }  

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: process.env.JWT_SEED
        }
      );

      const user = await this.authService.findUserById( payload.id );
      if( !user ) throw new UnauthorizedException('El usuario no existe, inicie sesión o suerte de aqui')
      if( !user.isActive ) throw new UnauthorizedException('El usuario no está activo, pailas')
  
      //console.log({ payload });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = user;
      
    } catch (error) {
      throw new UnauthorizedException();
    }
        
    //return Promise.resolve(true);
    return true;
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }





}
