import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    console.log(`[RolesGuard] User: ${user?.username}, Role: ${user?.role}, Required: ${requiredRoles}`);

    if (!user || !user.role) return false;
    
    // Ensure case-insensitive comparison and handle array correctly
    const userRole = user.role.toUpperCase();
    return requiredRoles.some(role => role.toUpperCase() === userRole);
  }
}
