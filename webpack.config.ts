import { EnvironmentPlugin } from 'webpack';
import { config } from 'dotenv';
config();

module.exports = {
    plugins: [
        new EnvironmentPlugin([
            'API_BASE_URL_DEV',
            'FILE_BASE_URL_DEV',
            'API_BASE_URL_UAT',
            'FILE_BASE_URL_UAT',
            'API_BASE_URL_Prod',
            'FILE_BASE_URL_Prod'
        ])
    ]
}
