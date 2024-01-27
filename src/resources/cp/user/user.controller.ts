// ================================================================>> Core Library
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes } from "@nestjs/common";

// ================================================================>> Third party Library
import * as bcrypt from 'bcryptjs';

// ================================================================>> Costom Library
import { UserService } from "./user.service";
import { Roles, UserRoleDecorator } from "src/middleware/decorators/rolse.decorator";
import { AuthGuard } from "src/middleware/guards/auth.guard";
import { User as UserDecorator } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from "src/middleware/interceptors/auth.interceptor";
import { CreateUserDto, UpdatePasswordDto, UpdateStatusDto, UpdateUserDto } from "./user.dto";
import { UsersTypeExistsPipe } from "src/shared/pipes/user.pipe";
import { FileResponse } from "src/shared/file.interface";
import { FileService } from "src/services/file.service";
import { Create, List, Update } from "./user.types";

@Roles(UserRoleDecorator.ADMIN)
@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {

    constructor(
        private userService: UserService,
        private fileService: FileService
    ) { };

    @Get()
    async listing(@UserDecorator() payload: UserPayload, @Query('key') key?: string, @Query('limit') limit?: number, @Query('page') page?: number): Promise<List> {
        // Set default values if not provided
        if (!limit) {
            limit = 10;
        }
        if (!page) {
            page = 1;
        }
        return await this.userService.listing(payload.user.id, key, limit, page);
    }

    @Post()
    @UsePipes(UsersTypeExistsPipe)
    async create(@Body() body: CreateUserDto, @UserDecorator() payload: UserPayload): Promise<Create> {
        const passwordHash = await bcrypt.hash(body.password, 12);
        body.password = passwordHash;
        const base64PrefixJPEG = 'data:image/jpeg;base64,';
        const base64PrefixPNG = 'data:image/png;base64,';
        if (!(typeof body.avatar === 'string' && (body.avatar.startsWith(base64PrefixJPEG) || body.avatar.startsWith(base64PrefixPNG)))) {
            throw new BadRequestException('Invalid image');
        }
        try {
            const avatar: FileResponse = await this.fileService.base64Image(body.avatar);
            body.avatar = avatar.data.uri;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
        return this.userService.create(body, payload.user.id);
    }

    @Put(':id')
    @UsePipes(UsersTypeExistsPipe)
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @UserDecorator() payload: UserPayload): Promise<Update> {
        if (body.avatar) {
            const base64PrefixJPEG = 'data:image/jpeg;base64,';
            const base64PrefixPNG = 'data:image/png;base64,';
            if (!(typeof body.avatar === 'string' && (body.avatar.startsWith(base64PrefixJPEG) || body.avatar.startsWith(base64PrefixPNG)))) {
                throw new BadRequestException('Invalid image');
            }
            try {
                const avatar: FileResponse = await this.fileService.base64Image(body.avatar);
                body.avatar = avatar.data.uri;
            } catch (error) {
                throw new BadRequestException(error.message);
            }
        }
        else {
            body.avatar = undefined;
        }
        return await this.userService.update(id, body, payload.user.id);
    }

    @Delete(':id')
    @HttpCode(200)
    async delete(@Param('id') id: number): Promise<{ status_code: number, message: string }> {
        return await this.userService.delete(id);
    }

    @Put(':id/change-status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStatusDto): Promise<{ status_code: number, message: string }> {
        return await this.userService.updateStatus(id, body);
    }

    @Put(':id/update-password')
    async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePasswordDto): Promise<{ status_code: number, message: string }> {
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