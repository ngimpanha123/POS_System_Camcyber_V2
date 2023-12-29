import { BadRequestException, ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import UsersType from "src/models/user/type.model";
import User from "src/models/user/user.model";
import { CreateUserDto, UpdateStatusDto, UpdateUserDto } from "./user.dto";

@Injectable()
export class UserService {

    async listing(userId: number, key?: string, limit: number = 10, page: number = 1) {
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
        const data = await User.findAndCountAll({
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
        const totalCount = data.count;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: data.rows,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalItems: totalCount,
                totalPages: totalPages
            }
        };
    }

    async create(body: CreateUserDto, userId: number) {
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

        return {
            statusCode: HttpStatus.OK,
            data: data
        };
    }

    async update(userId: number, body: UpdateUserDto, updaterId: number) {
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
        return {
            statusCode: HttpStatus.OK,
            data: updateUser,
            message: 'User has been updated successfully.'
        };
    }

    async delete(userId: number): Promise<{ statusCode: number, message: string }> {
        try {
            await User.destroy({
                where: {
                    id: userId
                }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Delete');
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'User has been deleted successfully.'
        };
    }

    async updateStatus(userId: number, body: UpdateStatusDto): Promise<{ statusCode: number, message: string }> {
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
            statusCode: HttpStatus.OK,
            message: 'Status has been updated successfully.'
        };
    }
}