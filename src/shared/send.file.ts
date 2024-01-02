import { Response } from 'express';
import * as fileSystem from 'fs';
import File from '../models/file.model';
import sharp from 'sharp';
import { BadRequestException } from '../../utils/exceptions.utils';

const sendFileResponse = async (res: Response, file: File, download: boolean, width?: number, height?: number) => {
    const headers = {
        'Content-Type': file.mimetype,
        'Content-Length': file.size
    };

    if (download) {
        headers['Content-disposition'] = `attachment; filename=${file.originalname}`;
    }

    if (download && file.mimetype.startsWith('image/') && width && height) {
        try {
            // Use sharp to resize the image
            const resizedImage = await sharp(file.path)
                .resize(width, height)
                .toBuffer();

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-disposition', `attachment; filename=${file.originalname}`);

            // Send the resized image as the response
            res.status(200).end(resizedImage);
        } catch (err) {
            throw new BadRequestException(err.message || 'Error while reading the file');
        }
    } else {
        res.writeHead(200, headers); // Set headers for the original file response

        const readStream = fileSystem.createReadStream(file.path);

        readStream.on('error', (err) => {
            throw new BadRequestException(err.message || 'Error while reading the file');
        });

        readStream.pipe(res);
    }
};

export default sendFileResponse;