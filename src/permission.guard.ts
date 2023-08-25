import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
    @Inject()
    private readonly reflector: Reflector;

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.user) {
            return true;
        }

        const permissions = request.user.permissions;

        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            'require-permission',
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions) {
            return true;
        }

        for (let i = 0; i < requiredPermissions.length; i++) {
            const curPermission = requiredPermissions[i];
            const found = permissions.find(
                (permission) => permission.code === curPermission,
            );
            if (!found) {
                throw new UnauthorizedException('您没有访问该接口的权限');
            }
        }

        return true;
    }
}
