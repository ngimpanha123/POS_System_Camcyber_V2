import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import responseSuccess from '../shared/success.res';
import handleFileUpload from '../shared/handle.file';
import FileService from '../services/files.service';
import sendFileResponse from '../shared/send.file';
import ValidationRequest from '../shared/validate.request';
import FilePayload from '../shared/interfaces/file-payload.interface';
import { formatDateData } from '../../utils/datetime.utils';
import selectFileProperties from '../shared/select.file';
import { BadRequestException } from '../../utils/exceptions.utils';

// Function to check if 'image' is a valid image string
const isImageString = (image: string): boolean => {
    const prefixJPEG = 'data:image/jpeg;base64,';
    const prefixPNG = 'data:image/png;base64,';
    return typeof image === 'string' && (image.startsWith(prefixJPEG) || image.startsWith(prefixPNG));
}

// Function to create a FilePayload
const createImagePayload = (fileName: string, filePath: string, buffer: Buffer): FilePayload => {
    return {
        fieldname: 'image',
        filename: fileName,
        originalname: `${fileName}.jpg`,
        mimetype: 'image/jpeg',
        destination: filePath,
        path: filePath,
        size: buffer.length,
        encoding: 'from-base64'
    };
}

const FileController = {
    base64: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (ValidationRequest(req, res)) {
                throw new BadRequestException(ValidationRequest(req, res));
            }
            const fileDir: string = 'public/uploads/';
            const base64Image = req.body.image;
            if (!isImageString(base64Image)) {
                throw new BadRequestException('Invalid image');
            }
            await fs.ensureDir('public/uploads');
            const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(imageData, 'base64');
            const sanitize = (text: string) => (text.replace(/[^\w]/gi, '') || 'unknown').toLowerCase();
            const mainFolder = sanitize(req.body.key);
            const subFolder = sanitize(req.body.folder);
            const date = formatDateData(new Date());
            const path = `${fileDir}${mainFolder}/${subFolder}/${date}`;
            const fileName = uuidv4();
            const filePath = `${path}/${fileName}`;
            await fs.mkdir(path, { recursive: true });
            await fs.writeFile(filePath, buffer);
            const file: FilePayload = createImagePayload(fileName, filePath, buffer);
            const uploadedFile = await handleFileUpload(res, file);
            responseSuccess(res, selectFileProperties(uploadedFile), 'File has been uploaded successfully!');
        } catch (error) {
            next(error);
        }
    },
    file: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                throw new BadRequestException('Invalid request. No file uploaded.');
            }
            const uploadedFile = await handleFileUpload(res, req.file);
            responseSuccess(res, selectFileProperties(uploadedFile), 'File has been uploaded successfully!');
        } catch (err) {
            next(err);
        }
    },
    files: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!Array.isArray(req.files) || req.files.length === 0) {
                throw new BadRequestException('Invalid request. No files uploaded.');
            }
            const uploadedFiles = await Promise.all(req.files.map((file) => handleFileUpload(res, file)));
            responseSuccess(res, uploadedFiles.map(selectFileProperties), 'Files have been uploaded successfully!');
        } catch (err) {
            next(err);
        }
    },
    read: async (req: Request, res: Response, next: NextFunction) => {
        const filename = req.params.filename;
        const download: boolean = req.query.download === 'true';
        const width: number = parseInt(req.query.width as string, 10) || 0;
        const height: number = parseInt(req.query.height as string, 10) || 0;
        try {
            const file = await FileService.findByFileName(filename);
            fs.access(file.path, fs.constants.F_OK, (err) => {
                if (err) throw new BadRequestException('File not found.');
                sendFileResponse(res, file, download, width, height);
            });
        } catch (error) {
            next(error);
        }
    }
};

export default FileController;