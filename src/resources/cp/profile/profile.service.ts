// ================================================================>> Core Library
import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';

// ================================================================>> Third Party Library
import { DatabaseError, Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

// ================================================================>> Costom Library
import { UpdatePasswordDto, UpdateProfileDto } from './profile.dto';
import User from 'src/models/user/user.model';
import { jwtConstants } from 'src/shared/constants.jwt';
import UsersType from 'src/models/user/type.model';

@Injectable()
export class ProfileService {

    async update(body: UpdateProfileDto, userId: number): Promise<{ access_token: string, message: string }> {
        //=============================================
        let currentUser: User;
        try {
            currentUser = await User.findByPk(userId);
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        if (!currentUser) {
            throw new BadRequestException('Invalid user_id');
        }

        //=============================================
        let checkExistPhone: User;
        try {
            checkExistPhone = await User.findOne({
                where: {
                    id: { [Op.not]: userId },
                    phone: body.phone
                }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        if (checkExistPhone) {
            throw new ConflictException('Phone is already in use');
        }

        //=============================================
        let checkExistEmail: User;
        try {
            checkExistEmail = await User.findOne({
                where: {
                    id: { [Op.not]: userId },
                    email: body.email
                }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        if (checkExistEmail) {
            throw new ConflictException('Email is already in use');
        }

        //=============================================
        try {
            await User.update(body, {
                where: { id: userId }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Update');
        }

        //=============================================
        let updateUser: User;
        try {
            updateUser = await User.findByPk(userId, {
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
                throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
            }
        }

        const token: string = this.generateToken(updateUser.id, updateUser.name, updateUser.email, updateUser.avatar, updateUser.phone, updateUser.type.name);
        return {
            access_token: token,
            message: 'Your profile has been updated successfully.'
        }
    }

    async updatePassword(userId: number, body: UpdatePasswordDto): Promise<{ status_code: number, message: string }> {
        //=============================================
        let currentUser: User;
        try {
            currentUser = await User.findByPk(userId);
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        if (!currentUser) {
            throw new BadRequestException('Invalid user_id');
        }

        const isPasswordValid = await bcrypt.compare(body.current_password, currentUser.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid current password', 'Password Error');
        }

        if (body.current_password === body.new_password) {
            throw new BadRequestException('New password should not the same current password');
        }

        const passwordHash = await bcrypt.hash(body.new_password, 12);
        body.new_password = passwordHash;

        //=============================================
        try {
            await User.update({
                password: body.new_password
            }, {
                where: { id: userId }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Update');
        }

        //=============================================
        return {
            status_code: HttpStatus.OK,
            message: 'Password has been updated successfully.'
        };
    }

    private generateToken(id: number, name: string, email: string, avatar: string, phone: string, role: string): string {
        return jwt.sign(
            {
                user: {
                    id: id,
                    name: name,
                    email: email,
                    phone: phone,
                    avatar: avatar,
                },
                role: role
            }, jwtConstants.secret,
            {
                expiresIn: jwtConstants.expiresIn
            }
        );
    }
}
