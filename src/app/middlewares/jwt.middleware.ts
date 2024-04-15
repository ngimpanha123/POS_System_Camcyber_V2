import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User from "src/models/user/user.model";
import { jwtConstants } from "src/app/shared/constants.jwt";

interface UserPayload {
    user: User;
    role: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Get token from headers
        const authorizationHeader = req.headers?.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization token is missing or not in the correct format.');
        }
        const token: string = authorizationHeader.split('Bearer ')[1];
        try {
            const payload = jwt.verify(token, jwtConstants.secret) as UserPayload;
            // Set role to locals for use everywhere in this server-side
            res.locals.role = payload.role;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Authorization token is expired.');
            }
            throw new UnauthorizedException('Authorization token is invalid.');
        }
        // If everything is fine, proceed to the next middleware
        next();
    }
}
