// ================================================================>> Third Party Library
import { Sequelize }    from 'sequelize';
import "colors";

// ================================================================>> Costom Library
import sequelizeConfig  from '../config/sequelize.config';

const createDatabase = async () => {
    const { dialect, database } = sequelizeConfig;

    const sequelize = new Sequelize({ ...sequelizeConfig, database: null });

    try {
        const checkDB = dialect === 'mysql' ? `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${database}'` : `SELECT datname FROM pg_database WHERE datname = '${database}'`;
        const result = await sequelize.query(checkDB);

        if (result && result[0].length > 0) {
            console.log('Database already exists.'.yellow);
        } else {
            const databaseName = dialect === 'mysql' ? `CREATE DATABASE ${database} CHARACTER SET utf8 COLLATE utf8_general_ci` : `CREATE DATABASE ${database} ENCODING 'UTF8'`;
            await sequelize.query(databaseName);
            console.log('Database created successfully.'.green);
        }
    } catch (error) {
        console.error('Error creating database:'.red, error.message);
    } finally {
        await sequelize.close();
    }
}

createDatabase();
