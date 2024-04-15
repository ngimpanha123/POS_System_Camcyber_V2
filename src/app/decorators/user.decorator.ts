// ================================================================>> Core Library
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { jwtConstants } from "src/shared/constants.jwt";
import * as jwt from 'jsonwebtoken';
import UserPayload from 'src/shared/user.payload';
import User from 'src/models/user/user.model';
import UsersType from 'src/models/user/type.model';

/**
 * @author Yim Klok <yimklok.kh@gmail.com>
 * @returns user
 */
const UserDecorator = createParamDecorator(async (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers?.authorization?.split('Bearer ')[1];
    const payload = jwt.verify(token, jwtConstants.secret) as UserPayload;
    if (payload && payload.user) {
        return await User.findByPk(payload.user.id, {
            attributes: ['id', 'name', 'avatar', 'phone', 'email', 'password'],
            include: [
                {
                    model: UsersType,
                    attributes: ['id', 'name']
                }
            ]
        });
    }
    return null;
})
export default UserDecorator;