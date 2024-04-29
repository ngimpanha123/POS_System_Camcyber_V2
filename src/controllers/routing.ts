import express from 'express';
import singleFileMulter from './multer';
import FileController from './controller';
import { UploadValidation } from './validation';

const fileRouter = express.Router();

fileRouter.get("/:filename",        FileController.read);
fileRouter.post("/upload",          singleFileMulter, FileController.upload);
fileRouter.post("/upload/base64",   UploadValidation, FileController.base64);

export default fileRouter;