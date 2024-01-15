import { Sequelize } from "sequelize-typescript";
import sequelizeConfig from "../config/sequelize.config";
import 'colors';

const main = async () => {
    const sequelize = new Sequelize(sequelizeConfig);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.'.green);
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database: '.yellow + (error.message).red);
        process.exit(0);
    } finally {
        await sequelize.close();
    }
}

main();