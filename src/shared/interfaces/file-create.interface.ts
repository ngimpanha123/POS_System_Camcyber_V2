export default interface FileCreate {
    folder_id   : number,
    type_id     : number,
    extention_id: number
    filename    : string;
    originalname: string;
    mimetype    : string;
    uri         : string
    path        : string;
    size        : number;
    encoding    : string;
}
