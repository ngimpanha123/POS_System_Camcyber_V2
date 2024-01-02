import express from 'express';
import ProjectController from '../controllers/project.controller';
import JWTAuthorization from '../middleware/jwt.middleware';
import { CreateProjectFields } from '../validation/project/create.validation';

const projectRouter = express.Router();

projectRouter.get("/project",        JWTAuthorization,   ProjectController.list);
projectRouter.get("/project/:id",    JWTAuthorization,   ProjectController.view);
projectRouter.post("/project",       JWTAuthorization,   CreateProjectFields, ProjectController.create);
projectRouter.put("/project/:id",    JWTAuthorization,   ProjectController.update);
projectRouter.delete("/project/:id", JWTAuthorization,   ProjectController.delete);

export default projectRouter;