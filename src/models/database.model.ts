import { Global, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import sequelizeConfig from "src/config/sequelize.config";
import models from "./models";


@Global()
@Module({
    imports: [
        SequelizeModule.forRoot({
            ...sequelizeConfig,
            models,
        })
    ]
})

export class DatabaseModule {}