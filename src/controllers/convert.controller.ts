import { Request, Response } from 'express';
import { Poppler } from "node-poppler";
import officeToPdf from 'office-to-pdf';
import fs from 'fs-extra';
import responseError from '../shared/error.res';
import responseSuccess from '../shared/success.res';
import deleteFile from '../shared/unlink.file';
import FilePayload from '../shared/interfaces/file-payload.interface';
import handleFileUpload from '../shared/handle.file';
import renameFile from '../shared/rename.file';
import File from '../models/file.model';
import selectFileProperties from '../shared/select.file';
import { BadRequestException } from '../../utils/exceptions.utils';

const outputImageDir = 'public/temp';
const tempPath = `${outputImageDir}.png`;
// The office files (word, excel and power point)
const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const validateFileType = (files: FilePayload[], expectedType: string): boolean => {
    for (const file of files) {
        if (file.mimetype !== expectedType) return false;
    }
    return true;
}
const handleErrorAndCleanup = (res: Response, files: FilePayload[], errorMessage: string) => {
    for (const file of files) {
        deleteFile(file.path);
    }
    console.error(errorMessage);
    return responseError(res, 400, errorMessage);
}
const convertPdfToImage = async (inputPdfPath: string, outputImagePath: string) => {
    /*== Poppler() for window and Poppler('/usr/bin') for docker ==*/
    const poppler = new Poppler('/usr/bin');
    const options = { pngFile: true, singleFile: true };
    const response = await poppler.pdfToCairo(inputPdfPath, outputImagePath, options);
    if (response !== 'No Error') throw new BadRequestException('Error while converting the file');
}

const getImage = async (pdfFile: FilePayload): Promise<FilePayload> => {
    try {
        await convertPdfToImage(pdfFile.path, outputImageDir);
        const targetFilePath = `${pdfFile.path}-page1`;
        await renameFile(tempPath, targetFilePath);
        const picFile: FilePayload = {
            fieldname: 'files',
            filename: `${pdfFile.filename}-page1`,
            originalname: `${pdfFile.originalname}.jpeg`,
            mimetype: 'image/jpeg',
            destination: pdfFile.destination,
            path: targetFilePath,
            size: (await fs.promises.stat(targetFilePath)).size,
            encoding: 'from-pdf',
        };
        return picFile;
    } catch (err) {
        throw err;
    }
}

const getPdf = async (officeFile: FilePayload): Promise<FilePayload> => {
    try {
        if (!fs.existsSync(officeFile.path)) {
            throw new BadRequestException('File not found or inaccessible');
        }
        const buffer: Buffer = fs.readFileSync(officeFile.path);
        const pdf: Buffer = await officeToPdf(buffer);
        fs.writeFileSync(`${officeFile.path}-pdf`, pdf);
        const pdfFile = {
            fieldname: officeFile.fieldname,
            filename: `${officeFile.filename}-pdf`,
            originalname: `${officeFile.originalname}.pdf`,
            mimetype: 'application/pdf',
            destination: officeFile.destination,
            path: `${officeFile.path}-pdf`,
            size: Buffer.byteLength(pdf),
            encoding: 'office',
        };
        return pdfFile;
    } catch (error) {
        throw error;
    }
}

const ConvertController = {
    pdfToImage: async (req: Request, res: Response) => {
        if (!validateFileType([req.file], 'application/pdf')) return handleErrorAndCleanup(res, [req.file], 'File must be the pdf file.');
        try {
            const picFile: FilePayload = await getImage(req.file);
            const uploadedOriginalFile = await handleFileUpload(res, req.file);
            const uploadedPicFile = await handleFileUpload(res, picFile);
            const dataFormat = {
                file: selectFileProperties(uploadedOriginalFile),
                picFile: selectFileProperties(uploadedPicFile),
            };
            return responseSuccess(res, dataFormat, 'File has been converted successfully');
        } catch (err) {
            return handleErrorAndCleanup(res, [req.file], err.message ? err.message : 'Error while saving the file');
        }
    },
    pdfsToImage: async (req: Request, res: Response) => {
        if (!Array.isArray(req.files)) return responseError(res, 400, 'Invalid request!');
        if (!validateFileType(req.files, 'application/pdf')) return handleErrorAndCleanup(res, req.files, 'All files must be the pdf files');
        const pdfFiles: File[] = [];
        const picFiles: File[] = [];
        for (const file of req.files) {
            try {
                const picFile: FilePayload = await getImage(file);
                const uploadedOriginalFile = await handleFileUpload(res, file);
                const uploadedPicFile = await handleFileUpload(res, picFile);
                pdfFiles.push(uploadedOriginalFile);
                picFiles.push(uploadedPicFile);
            } catch (err) {
                return handleErrorAndCleanup(res, req.files, err.message ? err.message : 'Error during PDF conversion');
            }
        }
        const dataFormat = {
            files: pdfFiles.map(selectFileProperties),
            picFiles: picFiles.map(selectFileProperties),
        };
        return responseSuccess(res, dataFormat, 'Files have been converted successfully');
    },
    officeToPdf: async (req: Request, res: Response) => {
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return handleErrorAndCleanup(res, [req.file], 'Invalid file type. Only Word, Excel, and PowerPoint documents are allowed.');
        }
        try {
            const pdfFile: FilePayload = await getPdf(req.file);
            const uploadedofficeFile = await handleFileUpload(res, req.file);
            const uploadedPdfFile = await handleFileUpload(res, pdfFile);
            const dataFormat = {
                file: selectFileProperties(uploadedofficeFile),
                pdfFile: selectFileProperties(uploadedPdfFile)
            }
            return responseSuccess(res, dataFormat, 'File has been converted successfully!');
        } catch (error) {
            console.error('Error:', error);
            return handleErrorAndCleanup(res, [req.file], error.message ?? 'Failed to create file. Please try again later.');
        }
    },
    officesToPdf: async (req: Request, res: Response) => {
        if (!Array.isArray(req.files)) return responseError(res, 400, 'Invalid request!');
        for (let file of req.files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return handleErrorAndCleanup(res, req.files, 'Invalid files type. Only Word, Excel, and PowerPoint documents are allowed.');
            }
        }
        const officeFiles: File[] = [];
        const pdfFiles: File[] = [];
        for (const file of req.files) {
            try {
                const pdfFile: FilePayload = await getPdf(file);
                const uploadedofficeFile = await handleFileUpload(res, file);
                const uploadedPdfFile = await handleFileUpload(res, pdfFile);
                officeFiles.push(uploadedofficeFile);
                pdfFiles.push(uploadedPdfFile);
            } catch (err) {
                return handleErrorAndCleanup(res, req.files, err.message ? err.message : 'Failed to convert the files. Please try again later.');
            }
        }
        const dataFormat = {
            files: pdfFiles.map(selectFileProperties),
            pdfFiles: pdfFiles.map(selectFileProperties),
        };
        return responseSuccess(res, dataFormat, 'Files have been converted successfully');
    },
    officeToPdfToImage: async (req: Request, res: Response) => {
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return handleErrorAndCleanup(res, [req.file], 'Invalid file type. Only Word, Excel, and PowerPoint documents are allowed.');
        }
        try {
            const pdfFile: FilePayload = await getPdf(req.file);
            const picFile: FilePayload = await getImage(pdfFile);
            const uploadedofficeFile = await handleFileUpload(res, req.file);
            const uploadedPdfFile = await handleFileUpload(res, pdfFile);
            const uploadedPicFile = await handleFileUpload(res, picFile);
            const dataFormat = {
                file: selectFileProperties(uploadedofficeFile),
                pdfFile: selectFileProperties(uploadedPdfFile),
                picFile: selectFileProperties(uploadedPicFile)
            }
            return responseSuccess(res, dataFormat, 'File has been converted successfully!');
        } catch (error) {
            console.error('Error:', error);
            return handleErrorAndCleanup(res, [req.file], error.message ?? 'Failed to create file. Please try again later.');
        }
    }
}

export default ConvertController; /** Completed: 15/10/2023 */