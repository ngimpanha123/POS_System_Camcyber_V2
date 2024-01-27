// ================================================================>> Core Library
import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

// ================================================================>> Third Party Library
import { Op } from "sequelize";

// ================================================================>> Custom Library
import UsersType from "src/models/user/type.model";
import User from "src/models/user/user.model";
import { CreateUserDto, UpdatePasswordDto, UpdateStatusDto, UpdateUserDto } from "./user.dto";
import { Create, List, Update } from "./user.types";

@Injectable()
export class UserService {

    async listing(userId: number, key?: string, limit: number = 10, page: number = 1): Promise<List> {
        const offset = (page - 1) * limit;
        const where = {
            [Op.and]: [
                key
                    ? {
                        [Op.or]: [
                            { name: { [Op.iLike]: `%${key}%` } },
                            { phone: { [Op.like]: `%${key}%` } },
                        ],
                    }
                    : {},
                { id: { [Op.not]: userId } },
            ],
        };
        const data = await User.findAll({
            attributes: ['id', 'name', 'avatar', 'phone', 'email', 'is_active', 'created_at'],
            where: where,
            include: [
                {
                    model: UsersType,
                    attributes: ['id', 'name']
                }
            ],
            order: [['id', 'DESC']],
            offset: offset,
            limit: limit,
        });
        const totalCount = await User.count();
        const totalPages = Math.ceil(totalCount / limit);

        const dataFormat: List = {
            data: data,
            pagination: {
                current_page: page,
                per_page: limit,
                total_items: totalCount,
                total_pages: totalPages
            }
        }

        return dataFormat;
    }

    async create(body: CreateUserDto, userId: number): Promise<Create> {
        let user: User;
        try {
            user = await User.findOne({
                where: {
                    [Op.or]: [
                        { phone: body.phone },
                        { email: body.email }
                    ]
                }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }

        if (user) {
            throw new BadRequestException('Email or phone already exists!.')
        }

        const crateUser = await User.create({
            type_id: body.type_id,
            name: body.name,
            avatar: body.avatar,
            phone: body.phone,
            email: body.email,
            password: body.password,
            creator_id: userId
        });

        const data = await User.findByPk(crateUser.id, {
            attributes: ['id', 'name', 'avatar', 'phone', 'email', 'is_active', 'created_at'],
            include: [
                {
                    model: UsersType,
                    attributes: ['id', 'name']
                }
            ]
        });

        const dataFormat: Create = {
            data: data,
            message: "User has been created"
        }

        return dataFormat;
    }

    async update(userId: number, body: UpdateUserDto, updaterId: number): Promise<Update> {
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
            console.log(error)
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        if (checkExistEmail) {
            throw new ConflictException('Email is already in use');
        }
        //=============================================
        try {
            await User.update({
                type_id: body.type_id,
                name: body.name,
                avatar: body.avatar,
                phone: body.phone,
                email: body.email,
                updater_id: updaterId
            }, {
                where: { id: userId }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Update');
        }
        //=============================================
        let updateUser: User;
        try {
            updateUser = await User.findByPk(userId, {
                attributes: ['id', 'name', 'avatar', 'phone', 'email', 'is_active', 'created_at'],
                include: [
                    {
                        model: UsersType,
                        attributes: ['id', 'name']
                    }
                ]
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        updateUser.password = undefined;

        //=============================================
        const dataFormat: Update = {
            data: updateUser,
            message: 'User has been updated successfully.'
        }
        return dataFormat;
    }

    async delete(userId: number): Promise<{ status_code: number, message: string }> {
        try {
            const rowsAffected = await User.destroy({
                where: {
                    id: userId
                }
            });

            if (rowsAffected === 0) {
                throw new NotFoundException('This user not found.');
            }

            return {
                status_code: HttpStatus.OK,
                message: 'User has been deleted successfully.'
            };
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Something went wrong!. Please try again later.', 'Error Delete');
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

        //=============================================
        try {
            await User.update(body, {
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

    async updateStatus(userId: number, body: UpdateStatusDto): Promise<{ status_code: number, message: string }> {
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
        try {
            await User.update(body, {
                where: { id: userId }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Update');
        }

        //=============================================
        return {
            status_code: HttpStatus.OK,
            message: 'Status has been updated successfully.'
        };
    }
}