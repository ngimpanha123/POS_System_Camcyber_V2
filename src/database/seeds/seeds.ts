import * as bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import sequelizeConfig from '../../configs/database.config';
import models from '../../models/models';

/** @models ==================================================================== */
import User from '../../models/user.model';
import Project from '../../models/project.model';
import Folder from '../../models/folder.model';
import Type from '../../models/type.model';
import Extension from '../../models/extension.model';
import File from '../../models/file.model';
/** @seeder ==================================================================== */
import fileSeed from './file.seed';
import projectSeed from './project.seed';
import userSeed from './user.seed';


async function seeds() {
    // Connect to the Dadabase
    const sequelize = new Sequelize(sequelizeConfig as { dialect: Dialect });
    // Initialize models from each group
    sequelize.addModels(models)

    try {
        await sequelize.authenticate();
        // drop all existing UserGroup in the database and recreate it again.
        await sequelize.sync({ force: true });

        /** @noted use bulkCreate to create multi data */

        /** @seedUser ======================================= */
        // Hash passwords before creating users
        for (const userData of userSeed.users) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        await User.bulkCreate(userSeed.users);
        await Project.bulkCreate(projectSeed.projects);
        await Folder.bulkCreate(fileSeed.folders);
        await Type.bulkCreate(fileSeed.types);
        await Extension.bulkCreate(fileSeed.extensions);
        await File.bulkCreate(fileSeed.files);

        console.log('\x1b[36m%s\x1b[0m', '\n==================================');
        console.log('\x1b[36m%s\x1b[0m', '||==============================||');
        console.log('\x1b[36m%s\x1b[0m', '||\x1b[32mSeeds completed successfully!.\x1b[0m\x1b[36m||\x1b[0m');
        console.log('\x1b[36m%s\x1b[0m', '||==============================||');
        console.log('\x1b[36m%s\x1b[0m', '==================================');
        process.exit(0);

    } catch (error) {

        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);

    }
}

seeds();
