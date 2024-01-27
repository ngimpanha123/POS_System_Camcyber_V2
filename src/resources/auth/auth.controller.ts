// ================================================================>> Core Library
import { Body, Post, Controller, HttpCode, HttpStatus } from '@nestjs/common';

// ================================================================>> Costom Library
import { AuthService } from './auth.service';
import { LoginRequestDto, UserDto } from './auth.dto';

@Controller('api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginRequestDto): Promise<{ access_token: string, token_type: string, expires_in: string, user: UserDto, role: string }> {
        return await this.authService.login(body);
    }
}
