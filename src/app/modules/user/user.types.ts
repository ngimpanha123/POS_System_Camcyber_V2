// Interface representing a paginated list of data
export interface List {
    data        : Data[],
    pagination  : {
        current_page    : number,
        per_page        : number,
        total_items     : number,
        total_pages     : number
    }
}

// Interface representing individual data items
export interface Data {
    id          : number,
    avatar      : string,
    name        : string,
    email       : string,
    phone       : string,
    is_active   : 1 | 0,
    created_at  : Date,
    type        : { id: number, name: string }
}

// Interface representing the structure of a user request
export interface RequestUser {
    name        : string,
    type_id     : string,
    phone       : string,
    email       : string,
    avatar?     : string,
    password?   : string
}

// Interface representing the structure of a response for a user
export interface ResponseUser {
    data        : Data,
    message     : string
}

// Interface representing the structure for updating a user's password
export interface UpdatePassword {
    password        : string,
    confirm_password: string
}

