import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { FileService } from 'src/services/file.service';
import { UserController } from './user.controller';

@Module({
    providers: [UserService, FileService],
    controllers: [UserController],
    imports: []
})
export class UserModule {}
