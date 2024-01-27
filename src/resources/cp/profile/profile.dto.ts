// =========================================================================>> Custom Library
import { IsEmail, IsNotEmpty, IsString, IsOptional , Matches, MinLength } from 'class-validator'

export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
        message: 'Phone must be valit Cambodia phone number'
    })
    phone: string

    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    avatar?: string
}

export class UpdatePasswordDto {
    @MinLength(6)
    @IsString()
    current_password: string

    @MinLength(6)
    @IsString()
    new_password: string

    @MinLength(6)
    @IsString()
    confirm_password: string
}