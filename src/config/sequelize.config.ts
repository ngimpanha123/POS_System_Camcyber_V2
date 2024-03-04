// ================================================================>> Core Library
import { SequelizeModuleOptions } from '@nestjs/sequelize';

// ================================================================>> Third Party Library
import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

/** @MySQL and @Postgresql */
const sequelizeConfig: SequelizeModuleOptions = {
    dialect: process.env.DB_CONNECTION as Dialect || 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    models: [__dirname + '/../models/**/*.model.{ts,js}'], // Process build and running it work with .js and local process like seeder it work with .ts
    logging: false
};

export default sequelizeConfig;
