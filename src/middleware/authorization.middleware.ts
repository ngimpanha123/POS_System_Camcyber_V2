import { Request, Response, NextFunction } from "express";
import ProjectService from "../services/project.service";
import FolderService from "../services/folder.service";
import { UnauthorizedException } from "../../utils/exceptions.utils";

// Helper function to get the authorization token from the header
const getAuthToken = (req: Request): string | undefined => {
    const authHeader = req.headers['authorization'];
    return authHeader && authHeader.split(' ')[1];
}

// Middleware function to check the project authorization
const Authorization = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const secret = getAuthToken(req);

        if (!secret) throw new UnauthorizedException('Authorization failed!. Secret must be provided');

        const project = await ProjectService.authorization(secret);
        if (!(project && (project.secret === secret)))
            throw new UnauthorizedException('Authorization failed!. Secret is invalid');

        if (project.authorized_ip !== req.ip && project.authorized_ip !== null)
            throw new UnauthorizedException('Authorization failed! IP is invalid');

        let folder = await FolderService.findByName(project.abbre);
        if (!folder) {
            folder = await FolderService.create({ project_id: project.id, parent_id: null, name: project.abbre.toLowerCase() });
        }

        /** user locals for sharing data to use other process on server-side */
        res.locals.project = project;
        res.locals.folder = folder;

        next();
    } catch (error) {
        next(error);
    }

}

export default Authorization;