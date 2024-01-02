import { Request, Response, NextFunction } from 'express';
import { formatDateData } from '../../utils/datetime.utils';
import multer from 'multer'
import fs from 'fs-extra';
import path from 'path';
import deleteFile from '../shared/unlink.file';
import multerStorage from '../shared/storage.multer';
import ValidationRequest from '../shared/validate.request';
import Extension from '../models/extension.model';
import { BadRequestException } from '../../utils/exceptions.utils';

const fileDir: string = 'public/';
const handleMultipleFilesUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 500 * 1024 * 1024, // allowed 500mb only (size of file)
        files: 500, // Maximum number of files allowed (e.g., 500 files)
    }
}).array('files');

const multipleFilesMulter = (req: Request, res: Response, next: NextFunction) => {
    // Execute the multer multiple files upload
    handleMultipleFilesUpload(req, res, async (error: multer.MulterError | any) => {
        try {
            if (error instanceof multer.MulterError) {
                const errorMessages = {
                    LIMIT_FILE_SIZE: 'File size limit exceeded!',
                    LIMIT_UNEXPECTED_FILE: 'Field "files" is required!',
                    LIMIT_FILE_COUNT: '500 files allowed! Please select less than or equal to 500 files.',
                };
                throw new BadRequestException(errorMessages[error.code] || 'Multer error.');
            } else if (error) throw new BadRequestException(`An unexpected error occurred: ${error.message}`);

            if (Array.isArray(req.files)) {
                if (req.files && req.files.length === 0) throw new BadRequestException('No files uploaded! Please select the files.');
                for (let file of req.files) {
                    const fileExtensionWithDot = path.extname(file.originalname);
                    const fileExtension = fileExtensionWithDot.substring(1);
                    const extention = await Extension.findOne({
                        where: { name: fileExtension }
                    });
                    if (!extention) {
                        for (let file of req.files) {
                            deleteFile(file.path);
                        }
                        throw new BadRequestException('Invalid file type');
                    }
                }
                const validationError = ValidationRequest(req, res);
                if (validationError) {
                    for (let file of req.files) {
                        deleteFile(file.path);
                    }
                    throw new BadRequestException(validationError);
                }
                const sanitize = (text: string) => (text.replace(/[^\w]/gi, '') || 'unknown').toLowerCase();
                const mainFolder = sanitize(req.body.key);
                const subFolder = sanitize(req.body.folder);
                const date = formatDateData(new Date());
                const destinationFolder = `${fileDir}/uploads/${mainFolder}/${subFolder}/${date}/`;
                // Create the destination folder if it doesn't exist
                await fs.ensureDir(destinationFolder);
                // Get a list of files in the source folder (fileDir)
                const files = await fs.readdir(fileDir);
                // Loop through each file and move it to the destination folder
                for (const file of files) {
                    const sourceFilePath = path.join(fileDir, file);
                    const destinationFilePath = path.join(destinationFolder, file);
                    const stat = await fs.stat(sourceFilePath);
                    // Check if it's a file (not a folder) before moving
                    if (stat.isFile()) await fs.move(sourceFilePath, destinationFilePath);
                }
                req.files = req.files.map(file => {
                    file.path = `${destinationFolder}${file.filename}`;
                    file.destination = destinationFolder;
                    return file;
                });
            }
            else throw new BadRequestException('Invalid request!');
            next();
        } catch (err) {
            next(err);
        }
    });
};

export default multipleFilesMulter;