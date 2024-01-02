import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import routes from './routes/router';
import bodyParser from 'body-parser';
import models from './models/models';
import sequelizeConfig from './configs/database.config';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import { GlobalErrorMiddleware } from './middleware/handling.middleware';
import { HttpStatus } from '../utils/http-status.utils';
import FileController from './controllers/file.controller';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 8080;

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Init application
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

/**==================================================================
 * @noted Register a route to render the HTML file
 */
app.get('/', (_req, res) => {
    res.render('index');
});

/**==================================================================
 * @noted read file by filename
 */
app.get("/upload/file/:filename", FileController.read);

/**==================================================================
 * @noted Use each route module from the array
 */
routes.forEach(route => {
    app.use('/api', route);
});

/**==================================================================
 * @noted Register the error handling (should be the last middleware)
 */
app.use(GlobalErrorMiddleware);

/**==================================================================
 * @noted Custom Not Found handler for route request
 */
app.use((req, res, next) => {
    res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Cannot ${req.method} ${req.originalUrl}`,
        error: 'Not Found',
    });
});

const main = async () => {
    try {
        // Connect to the Dadabase && Initialize models from each group
        const sequelize = new Sequelize(sequelizeConfig as { dialect: Dialect });
        sequelize.addModels(models);
        await sequelize.authenticate();

        app.listen(PORT, () => {
            console.log('\x1b[32mConnection has been established successfully.\x1b[0m\x1b[36m\x1b[0m');
            console.log('\x1b[32mNode API running on port: \x1b[34m' + PORT + '\x1b[0m');
        });
    } catch (error) {
        console.error('\x1b[33mUnable to connect to the database: \x1b[31m' + error.message + '\x1b[0m');
        process.exit(0);
    }
}
main();