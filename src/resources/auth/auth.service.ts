import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User from '../../models/user/user.model';
import UsersType from '../../models/user/type.model';
import { DatabaseError, Op } from 'sequelize';
import { jwtConstants } from 'src/shared/constants.jwt';
import { UserDto } from './auth.dto';

interface LoginParams {
    username: string
    password: string
}

export enum Status {
    Padding = 0,
    Approve = 1
}

@Injectable()
export class AuthService {
    /** @userLogin */
    async login(body: LoginParams): Promise<{ access_token: string, token_type: string, expires_in: string, user: UserDto, role: string }> {
        let user: User;
        try {
            user = await User.findOne({
                where: {
                    [Op.or]: [
                        { phone: body.username },
                        { email: body.username }
                    ],
                    is_active: Status.Approve
                },
                attributes: ['id', 'name', 'avatar', 'phone', 'email', 'password'],
                include: [
                    {
                        model: UsersType,
                        attributes: ['id', 'name']
                    }
                ]
            });
        } catch (error) {
            /** @databaseError */
            if (error instanceof DatabaseError && error.message.includes('invalid identifier')) {
                throw new BadRequestException('Invalid input data or database error', 'Database Error');
            } else {
                throw new BadRequestException('Server database error', 'Database Error');
            }
        }

        /** @userCredentailsInvalid */
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        /** @passwordInvalid */
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password', 'Password Error');
        }

        const role: string = user.type.name ?? '';

        /** @generateToken */
        const token = this.generateToken(user);
        const dataResponse = {
            access_token: token,
            token_type: 'bearer',
            expires_in: `${jwtConstants.expiresIn / 3600}h`,
            user: new UserDto(user),
            role: role
        };

        /** @responseBack */
        return dataResponse;
    }

    private generateToken(user: User): string {
        return jwt.sign(
            {
                user: new UserDto(user)
            }, jwtConstants.secret,
            {
                expiresIn: jwtConstants.expiresIn
            }
        );
    }
}
