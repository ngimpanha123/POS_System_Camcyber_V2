
// ================================================================>> Core Library
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

// ================================================================>> Costom Library
import { UserRoleDecorator } from "../decorators/roles.decorator";
import { jwtConstants } from "src/app/shared/constants.jwt";
import * as jwt from 'jsonwebtoken';
import UserPayload from "src/app/shared/user.payload";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext) {
        // Get all roles form custom Roles Decorator
        const roles = this.reflector.getAllAndOverride<UserRoleDecorator[]>('roles', [context.getHandler(), context.getClass()]);
        if (roles && roles.length > 0) {
            const request = context.switchToHttp().getRequest();
            // Get token from headers
            const authorizationHeader = request.headers?.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Authorization token is missing or not in the correct format.');
            }
            const token: string = authorizationHeader.split('Bearer ')[1];
            const payload = jwt.verify(token, jwtConstants.secret) as UserPayload;
            if (!roles.includes(payload.role as UserRoleDecorator)) {
                throw new ForbiddenException('Access forbidden for this role.')
            }
            return true; // Successful authentication and authorization
        }
        return false;
    }
}