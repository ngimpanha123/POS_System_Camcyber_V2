// ================================================================>> Costom Library
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from 'class-validator'
import { IsBase64Image } from 'src/app/decorators/base64-image.decorator'
import { UsersActiveEnum } from 'src/app/enums/user/active.enum'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsPositive()
    type_id: number

    @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
        message: 'Phone must be valit Cambodia phone number'
    })
    phone: string

    @IsEmail()
    email: string

    @MinLength(6)
    @IsString()
    password: string

    @IsString()
    @IsNotEmpty()
    @IsBase64Image({ message: 'Invalid image format. Image must be base64 encoded JPEG or PNG.' })
    avatar: string
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsPositive()
    type_id: number

    @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
        message: 'Phone must be valit Cambodia phone number'
    })
    phone: string

    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    @IsBase64Image({ message: 'Invalid image format. Image must be base64 encoded JPEG or PNG.' })
    avatar: string
}

export class UpdatePasswordDto {
    @MinLength(6)
    @IsString()
    password: string

    @MinLength(6)
    @IsString()
    confirm_password: string
}

export class UpdateStatusDto {
    @IsEnum(UsersActiveEnum)
    is_active: UsersActiveEnum;
}