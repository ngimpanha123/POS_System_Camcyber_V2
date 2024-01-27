// ================================================================>> Core Library
import { HttpStatus, Injectable } from '@nestjs/common';

// ================================================================>> Third Party Library
import axios from 'axios';
import * as fileSystem from 'fs';
import * as FormData from 'form-data';
import * as path from 'path';

const pathToTemp = process.env.FILE_DIR || './temp/';

@Injectable()
export class FileService {
    async callFileService(filePath: string, folder: string): Promise<any> {
        
        const fileUrl: string = process.env.FILE_URL || 'http://localhost:8080';
        const fileKey: string = process.env.FILE_KEY || 'POS';
        const username: string = process.env.FILE_USERNAME || 'CamCyber';
        const password: string = process.env.FILE_PASSWORD || 'pos@123';

        try {
            const imageStream = fileSystem.createReadStream(filePath);
            const formData = new FormData();
            formData.append('key', fileKey);
            formData.append('file', imageStream, {
                filename: 'temp.png',
                contentType: 'image/png'
            });
            formData.append('folder', folder);
            const response = await axios.post(fileUrl + '/api/file/upload-single', formData, {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`
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
