export interface UpdateProfile {
    name: string,
    avatar: string,
    phone: string,
    email?: string
}

export interface UpdatePassword {
    current_password: string,
    new_password: string,
    confirm_password: string
}
