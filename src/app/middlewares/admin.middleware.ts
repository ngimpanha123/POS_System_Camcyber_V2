import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Retrieve the user's role from res.locals, where it was set by JwtMiddleware.
        // This relies on the JwtMiddleware having successfully run beforehand and
        // attached the user's role to the response's locals storage.
        const role = res.locals.role as string;

        // Check if the retrieved role is 'admin'. Only users with an 'admin' role are allowed to proceed.
        // If the role is not 'admin', a ForbiddenException is thrown, indicating the user does not have
        // permission to access the resource.
        if (role !== 'Admin') {
            throw new ForbiddenException('Access denied. Not allowed to access to route.');
        }

        // If no role could be retrieved (i.e., role is undefined), it implies that the JWT middleware did not
        // successfully authenticate the user or did not find a valid role. In such cases, throw an
        // UnauthorizedException to indicate the request lacks valid authentication credentials.
        // This else branch might be unnecessary if JwtMiddleware already handles such cases, so consider
        // reviewing your logic to ensure it aligns with your application's authentication flow.
        if (!role) {
            throw new UnauthorizedException('Unauthorized');
        }

        // If the user's role is 'admin', proceed with the request to the next middleware or controller.
        next();
    }
}
