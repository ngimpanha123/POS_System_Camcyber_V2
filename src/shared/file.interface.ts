export interface FileResponse {
    statusCode: number,
    data: FilePayload,
    message: string
}

interface FilePayload {
    filename: string,
    originalname: string,
    mimetype: string,
    size: number,
    encoding: string,
    uri: string
}