import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Matches, MinLength } from 'class-validator'
import { UsersActiveEnum } from 'src/enums/user/active.enum'

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
    avatar: string

    @IsNumber()
    is_active: number
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

    @IsString()
    avatar?: string

    @IsNumber()
    is_active: number
}

export class UpdatePasswordDto {
    @MinLength(6)
    @IsString()
    password: string
}

export class UpdateStatusDto {
    @IsEnum(UsersActiveEnum)
    is_active: UsersActiveEnum;
}