import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

interface File {
    filename: string
    originalname: string
    uri: string
    size: number
    picFile: string
}

@Injectable()
export class FileService {

    private fileBaseUrl  = process.env.FILE_BASE_URL;
    private fileKey      = process.env.FILE_KEY;
    private fileUsername = process.env.FILE_USERNAME;
    private filePassword = process.env.FILE_PASSWORD;

    public uploadBase64Image = async (folder: string, base64: string) => {
        const result: { file?: File, error?: string } = {};
        try {
            const body = {
                key: this.fileKey,
                folder: folder,
                image: base64
            }
            const response = await axios.post(this.fileBaseUrl + '/api/file/upload-base64', body, {
                headers: {
                    Authorization: `Basic ${btoa(`${this.fileUsername}:${this.filePassword}`)}`
                }
            });
            result.file = response.data;
        } catch (error) {
            result.error = error?.response?.data?.message || 'Something when wrong';
        }
        return result
    }

    public uploadSingleFile = async (folder: string, file: Express.Multer.File) => {
        const result: { file?: File, error?: string } = {};
        try {
            const formData = new FormData();
            formData.append('key', this.fileKey);
            formData.append('folder', folder);
            formData.append('file', file.buffer, file.originalname);
            const response = await axios.post(this.fileBaseUrl + '/api/file/upload-single', formData, {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Basic ${btoa(`${this.fileUsername}:${this.filePassword}`)}`
                }
            });
            result.file = response.data.data;
        } catch (error) {
            result.error = error?.response?.data?.message || 'Something when wrong';
        }
        return result
    }
}
