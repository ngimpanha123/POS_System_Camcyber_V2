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
    id: number,
    avatar: string,
    name: string,
    email: string,
    phone: string,
    is_active: 1 | 0,
    created_at: Date,
    type: { id: number, name: string }
}

export interface RequestUser {
    name: string,
    type_id: string,
    phone: string,
    email: string,
    avatar?: string,
    password?: string
}

export interface ResponseUser {
    data: Data,
    message: string
}

export interface UpdatePassword {
    password: string,
    confirm_password: string
}

