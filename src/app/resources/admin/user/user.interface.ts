// ================================================================>> Costom Library
import User from "src/models/user/user.model";
import { Pagination } from "src/app/shared/pagination.interface";

export interface List {
    data: User[],
    pagination: Pagination
}

export interface Create {
    data: User,
    message: string
}

export interface Update {
    data: User,
    message: string
}