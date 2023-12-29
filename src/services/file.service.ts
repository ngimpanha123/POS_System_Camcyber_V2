import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fileSystem from 'fs';
import * as FormData from 'form-data';
import * as path from 'path';

const pathToTemp = process.env.FILE_DIR || './temp/';

@Injectable()
export class FileService {
    async callFileService(filePath: string, folder: string): Promise<any> {
        const fileServiceUrl = process.env.FILE_URL;
        try {
            const imageStream = fileSystem.createReadStream(filePath);
            const formData = new FormData();
            formData.append('key', 'POS');
            formData.append('file', imageStream, {
                filename: 'temp.png',
                contentType: 'image/png'
            });
            formData.append('folder', folder);
            const response = await axios.post(fileServiceUrl + '/api/file/upload-single', formData, {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Basic ${btoa('pos:pos@123')}`
                }
            });
            if (response.status === HttpStatus.OK) {
                const absoluteFilePath = path.join(pathToTemp, 'temp.png');
                fileSystem.unlink(absoluteFilePath, (err) => {
                    if (err) {
                        console.error(`Error deleting ${absoluteFilePath}: ${err.message}`);
                        throw new Error('Error while deleting the file!');
                    } else {
                        console.log(`Deleted ${absoluteFilePath} successfully.`);
                    }
                });
                return response.data;
            } else {
                throw new Error('File service returned an error');
            }

        } catch (error) {
            console.log("Error call to file :", error?.response?.data ?? error);
            throw new Error('Error while saving the file!. Please tye again later.');
        }
    }

    async base64Image(base64Image: string) {
        try {
            const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(imageData, 'base64');
            const fileName = 'temp.png';
            const filePath = `${pathToTemp}${fileName}`;
            await fileSystem.promises.mkdir(pathToTemp, { recursive: true });
            await fileSystem.promises.writeFile(filePath, buffer);
            return this.callFileService(filePath, 'Test');
        } catch (error) {
            console.log('Error save to temp: ', error);
            throw new Error('Error while saving avatar.');
        }
    }
}
