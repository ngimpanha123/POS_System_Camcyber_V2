import Project from "../models/project.model";
import ProjectCreate from "../shared/interfaces/project-create.interface";

const ProjectService = {
    create: async (body: ProjectCreate): Promise<Project> => {
        try {
            return await Project.create(body);
        } catch (error) {
            throw error;
        }
    },
    read: async (): Promise<Project[]> => {
        try {
            return await Project.findAll();
        } catch (error) {
            throw error;
        }
    },
    update: async (id: number, body: Project) => {
        try {
            return 'create: ' + body;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: number): Promise<number> => {
        try {
            return await Project.destroy({ where: { id: id } });
        } catch (error) {
            throw error;
        }
    },
    view: async (id: number): Promise<Project> => {
        try {
            return await Project.findByPk(id);
        } catch (error) {
            throw error;
        }
    },
    authorization: async (secret: string): Promise<Project> => {
        try {
            return await Project.findOne({
                where: {
                    secret: secret
                }
            });
        } catch (error) {
            throw error;
        }
    }
};

export default ProjectService;