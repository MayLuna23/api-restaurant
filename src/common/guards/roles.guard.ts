import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const allowRoles: string[] = ['admin']; // Define los roles permitidos
    if (!user || !allowRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }
}
