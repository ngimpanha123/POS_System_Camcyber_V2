import { Response } from "express";
import FilePayload from "./interfaces/file-payload.interface";
import FileCreate from "./interfaces/file-create.interface";
import FileService from "../services/files.service";
import File from "../models/file.model";
import Folder from "../models/folder.model";
import Extension from "../models/extension.model";
import path from 'path';
import Type from "../models/type.model";

const handleFileUpload = async (res: Response, file: FilePayload): Promise<File> => {
    try {
        const uri: string = `upload/file/${file.filename}`;
        const folder: Folder = res.locals.folder;
        /** extention no need handle in this. it has been handle before calling handleFileUpload */
        const fileExtensionWithDot = path.extname(file.originalname);
        const fileExtension = fileExtensionWithDot.substring(1);
        const extention = await Extension.findOne({
            where: { name: fileExtension },
            attributes: ['id', 'name'],
            include: [
                {
                    model: Type,
                    attributes: ['id', 'name']
                }
            ]
        });
        const fileCreate: FileCreate = {
            folder_id: folder?.id || null,
            type_id: extention?.type?.id || null,
            extention_id: extention?.id || null,
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            uri: uri,
            path: file.path,
            size: file.size,
            encoding: file.encoding
        }
        const fileResponse: File = await FileService.create(fileCreate);
        return fileResponse;
    } catch (err) {
        console.error('Error while creating file:', err);
        throw new Error('An error occurred while uploading the file.');
    }
};

export default handleFileUpload;