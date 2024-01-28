// Interface for updating user profile information
export interface UpdateProfile {
    name        : string,
    avatar      : string,
    phone       : string,
    email?      : string
}

// Interface for updating user password
export interface UpdatePassword {
    current_password    : string,
    new_password        : string,
    confirm_password    : string
}
