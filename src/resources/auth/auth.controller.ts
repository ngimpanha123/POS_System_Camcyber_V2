import { Body, Post, Controller, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, UserDto } from './auth.dto';

@Controller('api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    login(@Body() body: LoginRequestDto): Promise<{ access_token: string, token_type: string, expires_in: string, user: UserDto, role: string }> {
        return this.authService.login(body);
    }
}
