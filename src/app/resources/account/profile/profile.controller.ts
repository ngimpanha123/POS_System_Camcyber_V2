// ================================================================>> Core Library
import { Controller, Body, Put, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';

// ================================================================>> Costom Library
import UserDecorator from 'src/app/decorators/user.decorator';

//Custom Services and DTOs:
import { ProfileService } from './profile.service';
import { UpdatePasswordDto, UpdateProfileDto } from './profile.dto';

// File Handling:
import { FileService } from 'src/app/services/file.service';
import User from 'src/models/user/user.model';

@Controller()
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private fileService: FileService
    ) { };

    @Put('')
    async update(@Body() body: UpdateProfileDto, @UserDecorator() user: User): Promise<{ data: { access_token: string }, message: string }> {
        return await this.profileService.update(body, user.id);
    }

    @Put('update-password')
    @HttpCode(HttpStatus.OK)
    async updatePassword(@Body() body: UpdatePasswordDto, @UserDecorator() user: User): Promise<{ message: string }> {
        if (!(body.new_password === body.confirm_password)) {
            throw new BadRequestException('New password and confirm password do not match');
        }
        // remove confirm_password from body
        body.confirm_password = undefined;
        return this.profileService.updatePassword(user.id, body);
    }
}

