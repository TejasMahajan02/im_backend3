import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard extends AuthGuard {
  constructor(private reflector: Reflector, jwtService: JwtService) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, call the base AuthGuard to ensure the user is authenticated
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      // Unsuccessful authentication, return false
      return false;
    }

    // Successful authentication, user is injected
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Retrieve required roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // No roles required, allow access
      return true;
    }

    if (!user || !user.role) {
      // No user or roles, deny access
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}