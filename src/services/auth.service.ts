import User from "../models/user.model";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import jwtConstants from "../../utils/constants";
import { DatabaseError } from "sequelize";
import { BadRequestException } from "../../utils/exceptions.utils";

interface LoginParams {
    phone: string;
    password: string;
}

class TokenService {
    protected static generateToken = (user: User): string => {
        return jwt.sign(
            { user },
            jwtConstants.secret,
            { expiresIn: jwtConstants.expiresIn }
        );
    }
}

class AuthService extends TokenService {
    static login = async (body: LoginParams): Promise<{ access_token: string, token_type: string, expires_in: string, user: User }> => {
        try {
            let user: User | null = await User.findOne({
                where: {
                    phone: body.phone
                }
            });
            if (!user) throw new BadRequestException('Invalid credentials');
            const isPasswordValid = await bcrypt.compare(body.password, user.password);
            if (!isPasswordValid) throw new BadRequestException('Invalid password');
            user.password = undefined;
            const dataResponse = {
                access_token: TokenService.generateToken(user),
                token_type: 'bearer',
                expires_in: `${jwtConstants.expiresIn / 3600}h`,
                user: user
            };
            return dataResponse;
        } catch (error) {
            if (error instanceof DatabaseError && error.message.includes('invalid identifier')) {
                throw new BadRequestException('Invalid input data or database error');
            } else {
                throw new BadRequestException('Server database error');
            }
        }
    }
}

export default AuthService;