
// ================================================================>> Core Library
import { IsNotEmpty, IsString } from 'class-validator';

// ================================================================>> Costom Library
import User from 'src/models/user/user.model';

export class UserDto {
    id: number;
    name: string;
    avatar: string;
    phone: string;
    email: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.avatar = user.avatar;
        this.phone = user.phone;
        this.email = user.email;
    }
}

export class LoginRequestDto {

    @IsString()
    @IsNotEmpty({ message: "Filed username is required" })
    username: string

    @IsString()
    @IsNotEmpty()
    password: string;
}