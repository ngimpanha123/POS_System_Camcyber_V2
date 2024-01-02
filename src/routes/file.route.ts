import express from 'express';
import Authorization from '../middleware/authorization.middleware';
import singleFileMulter from '../configs/multer-file.config';
import multipleFilesMulter from '../configs/multer-files.config'
import FileController from '../controllers/file.controller';
import ConvertController from '../controllers/convert.controller';

const fileRouter = express.Router();

/**=======================================
 * @noted sigle file upload with form-data
 */
fileRouter.post("/file/upload-single", Authorization, singleFileMulter, FileController.file);

/**===========================================
 * @noted multiple files upload with form-data
 */
fileRouter.post("/file/upload-multiple", Authorization, multipleFilesMulter, FileController.files);

/**=======================================
 * @noted sigle base64-image upload
 */
fileRouter.post("/file/upload-base64", Authorization, FileController.base64);

/**================================================================
 * @noted convert single file of pdf to image (first page of pdf)
 */
fileRouter.post("/file/pdf-to-image", Authorization, singleFileMulter, ConvertController.pdfToImage);

/**================================================================
 * @noted convert multiple files of pdf to image (first page of pdf)
 */
fileRouter.post("/file/pdfs-to-image", Authorization, multipleFilesMulter, ConvertController.pdfsToImage);

/**=================================================================================
 *  @noted convert single file (word, excel and power point) to pdf with form-data
 */
fileRouter.post("/file/office-to-pdf", Authorization, singleFileMulter, ConvertController.officeToPdf);

/**==================================================================================
 *  @noted convert multiple files (word, excel and power point) to pdf with form-data
 */
fileRouter.post("/file/offices-to-pdf", Authorization, multipleFilesMulter, ConvertController.officesToPdf);

/**================================================================================================
 * @noted convert one file of (word or excel or power point) to pdf and to image (first page of pdf)
 */
fileRouter.post("/file/office-to-pdf-image", Authorization, singleFileMulter, ConvertController.officeToPdfToImage);

export default fileRouter;