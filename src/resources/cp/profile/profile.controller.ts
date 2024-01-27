// ================================================================>> Core Library
import { Controller, Body, UseGuards, Put, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';

// ================================================================>> Costom Library
import { UserPayload } from 'src/middleware/interceptors/auth.interceptor';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { User as UserDecorator } from 'src/middleware/decorators/user.decorator';

//Custom Services and DTOs:
import { ProfileService } from './profile.service';
import { UpdatePasswordDto, UpdateProfileDto } from './profile.dto';

// File Handling:
import { FileResponse } from 'src/shared/file.interface';
import { FileService } from 'src/services/file.service';

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private fileService: FileService
    ) { };

    @Put('')
    async update(
        @Body() body: UpdateProfileDto,
        @UserDecorator() payload: UserPayload,
    ): Promise<{ access_token: string, message: string }> {

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

        return await this.profileService.update(body, payload.user.id);
    }

    @Put('update-password')
    @HttpCode(HttpStatus.OK)
    async updatePassword(
        @Body() body: UpdatePasswordDto,
        @UserDecorator() payload: UserPayload,
    ): Promise<{ status_code: number, message: string }> {
        if (!(body.new_password === body.confirm_password)) {
            throw new BadRequestException('New password and confirm password do not match');
        }
        // remove confirm_password from body
        body.confirm_password = undefined;
        return this.profileService.updatePassword(payload.user.id, body);
    }
}

