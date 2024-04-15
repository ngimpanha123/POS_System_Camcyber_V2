// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { FileService } from 'src/services/file.service';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, FileService]
})
export class ProfileModule { }
