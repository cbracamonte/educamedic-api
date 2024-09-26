import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import authenticationConfig, {
  AuthenticationConfig,
} from 'src/core/config/authentication.config';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    @Inject(authenticationConfig.KEY)
    private readonly _authenticationConfig: AuthenticationConfig,
  ) {
    this.jwtSecret = this._authenticationConfig.jwtSecret;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.jwtSecret || this.jwtSecret === '') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide a valid token');
    }

    const authToken = authorization.replace(/bearer/gim, '').trim();

    try {
      verify(authToken, this.jwtSecret);
      return true;
    } catch (error) {
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In again',
      );
    }
  }
}
