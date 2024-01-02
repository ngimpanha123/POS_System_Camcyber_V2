import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { BadRequestException } from "../../utils/exceptions.utils";
import responseSuccess from "../shared/success.res";

class AuthController {
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.phone) throw new BadRequestException('Field phone is required');
            if (!req.body.password) throw new BadRequestException('Field password is required');
            const body: { phone: string, password: string } = {
                phone: req.body.phone,
                password: req.body.password,
            }
            responseSuccess(res, await AuthService.login(body));
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();