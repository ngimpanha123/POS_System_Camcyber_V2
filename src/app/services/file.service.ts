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

    public uploadBase64Image = async (folder: string, base64: string) => {
        const result: { file?: File, error?: string } = {};
        try {
            const body = {
                folder: folder,
                image: base64
            }
            const response = await axios.post(this.fileBaseUrl + '/service/file/upload/base64', body);
            result.file = response.data.data;
            
        } catch (error) {
            console.log(error);
            result.error = error?.response?.data?.message || 'Something when wrong. Failed call to saving the file';
        }
        return result
    }

    public uploadSingleFile = async (folder: string, file: Express.Multer.File) => {
        const result: { file?: File, error?: string } = {};
        try {
            const formData = new FormData();
            formData.append('folder', folder);
            formData.append('file', file.buffer, file.originalname);
            const response = await axios.post(this.fileBaseUrl + '/service/file/upload', formData);
            result.file = response.data.data;
        } catch (error) {
            result.error = error?.response?.data?.message || 'Something when wrong';
        }
        return result
    }
}