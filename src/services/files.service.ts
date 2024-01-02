import File from "../models/file.model";
import FileCreate from "../shared/interfaces/file-create.interface";

const FileService = {
    create: async (body: FileCreate): Promise<File> => {
        try {
            return await File.create(body);
        } catch (error) {
            throw error;
        }
    },
    read: async (): Promise<File[]> => {
        try {
            return await File.findAll();
        } catch (error) {
            throw error;
        }
    },
    update: async (id: number, body: File) => {
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
    view: async (id: number): Promise<File> => {
        try {
            return await File.findByPk(id);
        } catch (error) {
            throw error;
        }
    },
    findByFileName: async (filename: string): Promise<File> => {
        try {
            return await File.findOne({
                where: {
                    filename: filename
                }
            });
        } catch (error) {
            throw error;
        }
    }
};

export default FileService;
