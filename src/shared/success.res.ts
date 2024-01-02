import { Response } from "express";
import { HttpStatus } from "../../utils/http-status.utils";

const responseSuccess = <T>(res: Response, data: T, message?: string) => {
    res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: data,
        message: message || undefined,
    });
};

export default responseSuccess;