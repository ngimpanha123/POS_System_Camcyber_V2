// ================================================================>> Core Library
import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// ================================================================>> Third Party Library
import { SequelizeModule } from '@nestjs/sequelize';
import * as multer from 'multer';
// ================================================================>> Costom Library
import sequelizeConfig from 'src/config/sequelize.config';

/** @noded We use Global that allow all module can access and use all models */
@Global()
@Module({
    imports: [
        MulterModule.register({
            storage: multer.memoryStorage(),
        }),
        SequelizeModule.forRoot({
            ...sequelizeConfig
        })
    ]
})
export class ConfigModule { }
