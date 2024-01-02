import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import sequelizeConfig from '../../configs/database.config';
import models from '../../models/models';

const migrate = async () => {
    try {
        // Connect to the Dadabase
        const sequelize = new Sequelize(sequelizeConfig as { dialect: Dialect });
        // Initialize models from each group
        sequelize.addModels(models);
        await sequelize.authenticate();
        // This will drop and recreate tables
        await sequelize.sync({ force: true });
        console.log('\x1b[36m%s\x1b[0m', '\n=================================================');
        console.log('\x1b[36m%s\x1b[0m', '||=============================================||');
        console.log('\x1b[36m%s\x1b[0m', '||\x1b[32mMigrations has been established successfully.\x1b[0m\x1b[36m||\x1b[0m');
        console.log('\x1b[36m%s\x1b[0m', '||=============================================||');
        console.log('\x1b[36m%s\x1b[0m', '=================================================');
        process.exit(0);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);
    }
}

migrate();