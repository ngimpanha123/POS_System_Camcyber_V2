import { Request, Response } from "express";
import Project from "../models/project.model";

const ValidationRequest = (req: Request, res: Response) => {
    const project: Project = res.locals.project;
    if (!(req.body.key || req.body.folder)) {
        return 'Fields key and folder are required!';
    } else if (!req.body.folder) {
        return 'Field folder is required!';
    } else if (!req.body.key) {
        return 'Field key is required!';
    }
    else if (project.abbre !== req.body.key) {
        return 'Field key is invalid!';
    }
    return null;
};

export default ValidationRequest;