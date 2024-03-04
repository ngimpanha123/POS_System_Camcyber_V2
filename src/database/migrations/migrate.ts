// ================================================================>> Third Party Library
import { Sequelize } from 'sequelize-typescript';
import * as readlineSync from 'readline-sync';
import "colors";
// ================================================================>> Costom Library
import sequelizeConfig from '../../config/sequelize.config';

async function migrate() {
    const sequelize = new Sequelize(sequelizeConfig);
    try {
        // Check if there are any existing tables in the database
        const tableNames = await sequelize.getQueryInterface().showAllTables();
        if (tableNames.length > 0) {
            // Ask the user for confirmation only if there are existing tables
            const message = 'This will drop and recreate all tables. Are you sure you want to proceed?'.yellow;
            const confirmation = readlineSync.keyInYNStrict(message);

            if (!confirmation) {
                console.log('\nMigration aborted.'.cyan);
                process.exit(0);
            }
        }
        // Drop all existing tables in the database and recreate them according to your model definitions.
        await sequelize.sync({ force: true });
        console.log('\nMigration completed successfully.'.green);
        process.exit(0);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);
    }
}

migrate();
