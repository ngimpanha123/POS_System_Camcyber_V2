// ================================================================>> Core Library
import { Body, Post, Controller, HttpCode, HttpStatus } from '@nestjs/common';

// ================================================================>> Costom Library
import { AuthService } from './auth.service';
import { LoginRequestDto, UserDto } from './auth.dto';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: LoginRequestDto): Promise<{ access_token: string, expires_in: string, user: UserDto }> {
        return await this.authService.login(data);
    }
}
