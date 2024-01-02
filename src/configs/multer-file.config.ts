import { Request, Response, NextFunction } from 'express';
import { formatDateData } from '../../utils/datetime.utils';
import multer from 'multer'
import fs from 'fs-extra';
import path from 'path';
import deleteFile from '../shared/unlink.file';
import ValidationRequest from '../shared/validate.request';
import renameFile from '../shared/rename.file';
import multerStorage from '../shared/storage.multer';
import Extension from '../models/extension.model';
import { BadRequestException } from '../../utils/exceptions.utils';

const fileDir: string = 'public/';
const handleSingleFileUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 200 * 1024 * 1024, // allowed 200mb only (size of file)
        files: 1, // Only file can upload
    }
}).single('file');

const singleFileMulter = (req: Request, res: Response, next: NextFunction) => {
    // Execute the multer single file upload
    handleSingleFileUpload(req, res, async (error: multer.MulterError | any) => {
        try {
            if (error instanceof multer.MulterError) {
                const errorMessages = {
                    LIMIT_FILE_SIZE: 'File size limit exceeded.',
                    LIMIT_UNEXPECTED_FILE: 'Field "file" is required.',
                    LIMIT_FILE_COUNT: 'Only one file allowed! Please select only one file.',
                };
                throw new BadRequestException(errorMessages[error.code] || 'Multer error.');
            } else if (error) throw new BadRequestException(`An unexpected error occurred: ${error.message}`);
            if (!req.file) throw new BadRequestException('No file uploaded! Please select a file.');
            const fileExtensionWithDot = path.extname(req.file.originalname);
            const fileExtension = fileExtensionWithDot.substring(1);
            const extention = await Extension.findOne({
                where: { name: fileExtension }
            });
            if (!extention) {
                deleteFile(req.file.path);
                throw new BadRequestException('Invalid file type');
            }
            const validationError = ValidationRequest(req, res);
            if (validationError) {
                deleteFile(req.file.path);
                throw new BadRequestException(validationError);
            }
            const sanitize = (text: string) => (text.replace(/[^\w]/gi, '') || 'unknown').toLowerCase();
            const mainFolder = sanitize(req.body.key);
            const subFolder = sanitize(req.body.folder);
            const date = formatDateData(new Date());
            const destinationFolder = `${fileDir}/uploads/${mainFolder}/${subFolder}/${date}/`;
            await fs.ensureDir(destinationFolder);
            const sourceFilePath = req.file.path;
            const targetFilePath = `${destinationFolder}${req.file.filename}`;
            await renameFile(sourceFilePath, targetFilePath);
            req.file.path = targetFilePath;
            req.file.destination = destinationFolder;
            next();
        } catch (err) {
            console.error('Error during process the file:', err);
            next(err);
        }
    });
};

export default singleFileMulter;