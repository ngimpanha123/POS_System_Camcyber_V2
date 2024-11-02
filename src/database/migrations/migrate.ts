import { Sequelize } from 'sequelize-typescript';
import sequelizeConfig from '../../config/sequelize.config';
import models from '../../models/models';
import * as readlineSync from 'readline-sync';
import "colors"

async function migrate() {
    // Ask the user for confirmation
    const message = 'This will drop and recreate all tables. Are you sure you want to proceed?'.yellow;
    const confirmation = readlineSync.keyInYNStrict(message);

    if (!confirmation) {
        console.log('\nMigration aborted.'.cyan);
        process.exit(0);
    }

    const sequelize = new Sequelize(sequelizeConfig);

    // Initialize models from each group
    sequelize.addModels(models);

    try {
        // drop all existing tables in the database and recreate them according to your model definitions.
        await sequelize.sync({ force: true });
        console.log('\nMigration completed successfully.'.green);
        process.exit(0);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);
    }

}

migrate();
