export interface List {
    data: Data[],
    pagination: {
        current_page: number,
        per_page: number,
        total_items: number,
        total_pages: number
    }
}

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

export interface RequestUser {
    username: string,
    kh_name: string,
    en_name: string,
    phone: string,
    email: string,
    tg_username: string,
    sex: number,
    about: string,
    organization_id: number,
    role_id: number,
    title_id: number,
    position_id: number,
    password: string,
    com_password: string,
    system_role_id: number,
    avatar: string,
    signature: string
}

export interface ResponseUser {
    statusCode: string,
    data: Data,
    message: string
}

export interface RequestPutUser {
    username: string,
    kh_name: string,
    en_name: string,
    phone: string,
    email: string,
    tg_username: string,
    sex: number,
    about: string,
    organization_id: number,
    role_id: number,
    title_id: number,
    position_id: number,
    password: string,
    com_password: string,
    system_role_id: number,
    avatar?: string,
    signature?: string
}

export interface ReqPutPassword {
    newPassword: string,
    newConfirmPassword: string
}

export interface ResPutPassword {
    statusCode: number,
    message: string
}

export interface ResponseSetup {
    data: Setup,
    message: string
}

export interface Setup {
    categories: {
        id: number,
        name: string,
        abbre: string,
        organizations: {
            id: number,
            kh_name: string,
            abbre: string
        }[]
    }[],
    positions: {
        id: number,
        name: string,
        abbre: string
    }[],
    sex_titles: {
        id: number,
        name: string,
        title: {
            id: number,
            name: string,
            abbre: string
        }[]
    }[],
    roles: {
        id: number,
        kh_name: string
    }[]
}

