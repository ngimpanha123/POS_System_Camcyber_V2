
// ================================================================>> Core Library
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector }            from "@nestjs/core";

// ================================================================>> Third Party Library
import * as jwt                 from 'jsonwebtoken';

// ================================================================>> Costom Library
import { jwtConstants }         from "src/shared/constants.jwt";
import { UserRoleDecorator }    from "../decorators/rolse.decorator";
import { UserPayload }          from "../interceptors/auth.interceptor";
import User                     from "../../models/user/user.model";
import UsersType                from "../../models/user/type.model";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    async canActivate(context: ExecutionContext) {
        const roles: UserRoleDecorator[] = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);
        if (roles && roles.length > 0) {

            const request = context.switchToHttp().getRequest();
            const authorizationHeader = request.headers?.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Authorization token is missing or not in the correct format.');
            }

            const token: string = authorizationHeader.split('Bearer ')[1];
            let payload: UserPayload;

            try {
                payload = jwt.verify(token, jwtConstants.secret) as UserPayload;
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Authorization token is expired.');
                }
                throw new UnauthorizedException('Authorization token is invalid.');
            }

            const userId = payload?.user?.id;
            if (!userId) {
                throw new UnauthorizedException('User ID not found in token payload..');
            }
            const user = await User.findOne({
                where: {
                    id: userId
                },
                include: UsersType
            });
            if (!user) {
                throw new UnauthorizedException('User not found.');
            }
            const role = user.type.name as UserRoleDecorator;
            if (!roles.includes(role)) {
                throw new ForbiddenException('Access forbidden for this role.')
            }
            return true; // Successful authentication and authorization
        }
    }
}