import File from "../models/file.model";

const selectFileProperties = (file: File): { filename: string, originalname: string, uri: string, size: number } => {
    return {
        filename: file.filename || "",
        originalname: file.originalname || "",
        uri: file.uri || "",
        size: file.size || 0
    };
}

export default selectFileProperties;