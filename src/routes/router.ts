import fileRouter from "./file.route";
import projectRouter from "./project.route";
import userRouter from "./user.route";

const routes = [userRouter, projectRouter, fileRouter];

export default routes;