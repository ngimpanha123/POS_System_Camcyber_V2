export default interface FolderCreate {
    project_id: number,
    parent_id : number | null,
    name      : string
}
