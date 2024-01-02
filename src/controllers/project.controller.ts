import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import ProjectService from "../services/project.service";
import { HttpStatus } from "../../utils/http-status.utils";
import { BadRequestException, HttpException } from "../../utils/exceptions.utils";
import Project from "../models/project.model";
import selectProjectProperties from "../shared/select.project";
import { validationResult } from 'express-validator';
import FilePayload from "../shared/interfaces/file-payload.interface";
import handleFileUpload from "../shared/handle.file";
import responseSuccess from "../shared/success.res";
import ProjectCreate from "../shared/interfaces/project-create.interface";

const fileDir: string = 'public/';
// Validation function
const validateRequest = (req: Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException("Invalid entity", HttpStatus.BAD_REQUEST, errors.array());
    }
}
// Function to check if 'icon' is a valid image string
const isImageString = (icon: string): boolean => {
    const prefixJPEG = 'data:image/jpeg;base64,';
    const prefixPNG = 'data:image/png;base64,';
    return typeof icon === 'string' && (icon.startsWith(prefixJPEG) || icon.startsWith(prefixPNG));
}
// Function to extract image buffer
const extractImageBuffer = (icon: string): Buffer => {
    const imageData = icon.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(imageData, 'base64');
}
// Function to generate a unique file name
const generateUniqueFileName = (): string => {
    return uuidv4();
}
// Function to save the image
const saveImage = async (buffer: Buffer, fileName: string): Promise<string> => {
    const path = `${fileDir}project/create`;
    const filePath = `${path}/${fileName}`;
    await fs.ensureDir('public');
    await fs.mkdir(path, { recursive: true });
    await fs.writeFile(filePath, buffer);
    return filePath;
}
// Function to create a FilePayload
const createFilePayload = (fileName: string, filePath: string, buffer: Buffer): FilePayload => {
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

const ProjectController = {
    list: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const projects = await ProjectService.read();
            let newData: any[];
            if (projects.length > 0) {
                newData = projects.map(selectProjectProperties);
            }
            responseSuccess(res, newData);
        } catch (error) {
            next(error)
        }
    },
    view: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Number(id)) {
                throw new BadRequestException("Invalid project id.");
            }
            const project: Project = await ProjectService.view(Number(id));
            if (!project) throw new BadRequestException("Invalid project id.");
            responseSuccess(res, project);
        } catch (error) {
            next(error)
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fs.ensureDir('public');
            validateRequest(req);
            let { name, abbre, icon, secret, authorized_ip }: ProjectCreate = req.body;
            if (isImageString(icon)) {
                const buffer = extractImageBuffer(icon);
                const fileName = generateUniqueFileName();
                const filePath = await saveImage(buffer, fileName);
                const file: FilePayload = createFilePayload(fileName, filePath, buffer);
                const uploadedFile = await handleFileUpload(res, file);
                icon = uploadedFile.uri;
                const project = await ProjectService.create({ name, abbre, icon, secret, authorized_ip });
                responseSuccess(res, project, 'Project has been created successfully!');
            } else {
                throw new BadRequestException('Invalid image');
            }
        } catch (error) {
            next({
                statusCode: error.statusCode || HttpStatus.BAD_REQUEST,
                message: error.message || 'Unkown error',
                error: error.errors || error
            });
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projects = await ProjectService.read();
        } catch (error) {
            next(error)
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!Number(id)) throw new BadRequestException("Invalid project id.");
            const idDeleted: number = await ProjectService.delete(Number(id));
            if (!idDeleted) throw new BadRequestException("Invalid project id.");
            throw new HttpException('Project has been deleted successfully.', HttpStatus.OK);
        } catch (error) {
            next(error)
        }
    }
}

export default ProjectController;