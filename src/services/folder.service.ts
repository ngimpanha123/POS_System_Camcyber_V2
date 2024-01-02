import Folder from "../models/folder.model";
import FolderCreate from "../shared/interfaces/folder-create.interface";

const FolderService = {
    create: async (body: FolderCreate): Promise<Folder> => {
        try {
            return await Folder.create(body);
        } catch (error) {
            throw error;
        }
    },
    read: async (): Promise<Folder[]> => {
        try {
            const folder = await Folder.findAll();
            if (!folder) return null;
            return folder;
        } catch (error) {
            throw error;
        }
    },
    update: async (id: number, body: Folder) => {
        try {
            return 'create: ' + body;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            return 'delete id: ' + id;
        } catch (error) {
            throw error;
        }
    },
    findByPk: async (id: number): Promise<Folder> => {
        try {
            return await Folder.findByPk(id);
        } catch (error) {
            throw error;
        }
    },
    findByName: async (name: string): Promise<Folder> => {
        try {
            return await Folder.findOne({
                where: {
                    name: name
                }
            });
        } catch (error) {
            throw error;
        }
    }
};

export default FolderService;