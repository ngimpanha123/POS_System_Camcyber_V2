import dotenv from 'dotenv';
dotenv.config();

/** @MySQL && @Postgres */
const sequelizeConfig = {
    dialect: process.env.DB_CONNECTION || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 2002,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'pms',
    logging: (sql: unknown) => {
        console.log('Executing SQL:', sql);
    },
};

/** @Oracle */
// const dbConnectString = `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_HOST})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SERVICE_NAME=${process.env.DB_TNS})))`;
// const sequelizeConfig = {
//     dialect: process.env.DB_CONNECTION || 'oracle',
//     dialectModulePath: 'oracledb',
//     username: process.env.DB_USERNAME || 'PMS_DEV',
//     password: process.env.DB_PASSWORD || 'CamCyber',
//     logging: (sql: unknown) => {
//         console.log('Executing SQL:', sql);
//     },
//     dialectOptions: {
//         connectString: dbConnectString,
//     }
// };

export default sequelizeConfig;