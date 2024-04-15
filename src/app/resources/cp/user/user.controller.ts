// ================================================================>> Core Library
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes } from "@nestjs/common";

// ================================================================>> Third party Library
import * as bcrypt from 'bcryptjs';

// ================================================================>> Costom Library
// Middlware
import UserDecorator from 'src/app/decorators/user.decorator';

// Shared
import { UsersTypeExistsPipe } from "src/app/pipes/user.pipe";
import { FileService } from "src/app/services/file.service";

// Inside Module
import { CreateUserDto, UpdatePasswordDto, UpdateStatusDto, UpdateUserDto } from "./user.dto";
import { UserService } from "./user.service";
import { Create, List, Update } from "./user.interface";
import User from "src/models/user/user.model";

@Controller()
export class UserController {

    constructor(
        private userService: UserService,
        private fileService: FileService
    ) { };

    @Get()
    async listing(@UserDecorator() user: User, @Query('key') key?: string, @Query('limit') limit?: number, @Query('page') page?: number): Promise<List> {
        // Set default values if not provided
        if (!limit) {
            limit = 10;
        }
        if (!page) {
            page = 1;
        }
        return await this.userService.listing(user.id, key, limit, page);
    }

    @Post()
    @UsePipes(UsersTypeExistsPipe)
    async create(@Body() body: CreateUserDto, @UserDecorator() user: User): Promise<Create> {
        const passwordHash = await bcrypt.hash(body.password, 12);
        body.password = passwordHash;
        return this.userService.create(body, user.id);
    }

    @Put(':id')
    @UsePipes(UsersTypeExistsPipe)
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @UserDecorator() user: User): Promise<Update> {
        return await this.userService.update(id, body, user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this.userService.delete(id);
    }

    @Put(':id/change-status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStatusDto): Promise<{ message: string }> {
        return await this.userService.updateStatus(id, body);
    }

    @Put(':id/update-password')
    async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePasswordDto): Promise<{ message: string }> {
        if (!(body.password === body.confirm_password)) {
            throw new BadRequestException('Password and confirm password do not match');
        }
        // remove confirm_password from body and hash the password
        body.confirm_password = undefined;
        const passwordHash = await bcrypt.hash(body.password, 12);
        body.password = passwordHash;
        return await this.userService.updatePassword(id, body);
    }
}