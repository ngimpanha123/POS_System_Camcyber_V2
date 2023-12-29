import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles, UserRoleDecorator } from "src/middleware/decorators/rolse.decorator";
import { AuthGuard } from "src/middleware/guards/auth.guard";
import { User as UserDecorator } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from "src/middleware/interceptors/auth.interceptor";
import { CreateUserDto, UpdateStatusDto, UpdateUserDto } from "./user.dto";
import { UsersTypeExistsPipe } from "src/shared/pipes/user.pipe";
import * as bcrypt from 'bcryptjs';
import { FileResponse } from "src/shared/file.interface";
import { FileService } from "src/services/file.service";
import { UsersActiveEnum } from "src/enums/user/active.enum";

@Roles(UserRoleDecorator.ADMIN)
@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {

    constructor(
        private userService: UserService,
        private fileService: FileService
    ) { };

    @Get()
    async listing(
        @UserDecorator() payload: UserPayload,
        @Query('key') key?: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number
    ) {
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
    async create(
        @Body() body: CreateUserDto,
        @UserDecorator() payload: UserPayload
    ) {

        const passwordHash = await bcrypt.hash(body.password, 12);
        body.password = passwordHash;

        // Check if the image is a string and starts with the valid prefixes
        const base64PrefixJPEG = 'data:image/jpeg;base64,';
        const base64PrefixPNG = 'data:image/png;base64,';
        if (!(typeof body.avatar === 'string' && (body.avatar.startsWith(base64PrefixJPEG) || body.avatar.startsWith(base64PrefixPNG)))) {
            throw new BadRequestException('Invalid image');
        }
        let avatar: FileResponse;
        try {
            avatar = await this.fileService.base64Image(body.avatar);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
        // replace base64 string by file uri from FileService
        body.avatar = avatar.data.uri;
        body.is_active = UsersActiveEnum.Active;

        return this.userService.create(body, payload.user.id);
    }

    @Put(':id')
    @UsePipes(UsersTypeExistsPipe)
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @UserDecorator() payload: UserPayload) {
        if (body.avatar) {
            // Check if the image is a string and starts with the valid prefixes
            const base64PrefixJPEG = 'data:image/jpeg;base64,';
            const base64PrefixPNG = 'data:image/png;base64,';
            if (!(typeof body.avatar === 'string' && (body.avatar.startsWith(base64PrefixJPEG) || body.avatar.startsWith(base64PrefixPNG)))) {
                throw new BadRequestException('Invalid image');
            }
            let avatar: FileResponse;
            try {
                avatar = await this.fileService.base64Image(body.avatar);
            } catch (error) {
                throw new BadRequestException(error.message);
            }
            // replace base64 string by file uri from FileService
            body.avatar = avatar.data.uri;
        }
        else {
            body.avatar = undefined;
        }
        return await this.userService.update(id, body, payload.user.id);
    }

    @Delete(':id')
    @HttpCode(200)
    async delete(@Param('id') id: number): Promise<{ statusCode: number, message: string }> {
        return await this.userService.delete(id);
    }

    @Patch(':id/change-status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStatusDto): Promise<{ statusCode: number, message: string }> {
        return await this.userService.updateStatus(id, body);
    }
}