// ================================================================>> Custom Library
import { User } from "../user/user.types";

export interface LoginResponse {
    status_code: number,
    data: {
        access_token    : string,
        token_type      : string,
        expires_in      : string,
        user            : User,
        role            : string
    }
}
