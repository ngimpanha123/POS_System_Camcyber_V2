import { Sequelize } from 'sequelize-typescript';
import sequelizeConfig from '../../config/sequelize.config';
import models from '../../models/models';
import { ProductSeeder } from './product.seeder';
import { OrderSeeder } from './order.seeder'
import { UserSeeder } from './user.seeder';
import * as readlineSync from 'readline-sync';
import "colors"

async function seeds() {

    // Ask the user for confirmation
    const message = 'This will drop and seed agian. Are you sure you want to proceed?'.yellow;
    const confirmation = readlineSync.keyInYNStrict(message);

    if (!confirmation) {
        console.log('\nSeeders has been cancelled.'.cyan);
        process.exit(0);
    }

    // Connect to the Dadabase
    const sequelize = new Sequelize(sequelizeConfig);

    // Initialize models from each group
    sequelize.addModels(models)

    try {
        // drop all existing UserGroup in the database and recreate it again.
        await sequelize.sync({ force: true });

        /** @seedUser ======================================= */
        const userSeeder = new UserSeeder();
        await userSeeder.seed();

        /** @seedProduct ======================================= */
        const productSeeder = new ProductSeeder();
        await productSeeder.seed();

        /** @seedOrder ======================================= */
        const orderSeeder = new OrderSeeder();
        await orderSeeder.seed();

        // End of execution
        process.exit(0);

    } catch (error) {
        // Delete all if have a errors
        await sequelize.sync({ force: true });
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);

    }
}

seeds();
