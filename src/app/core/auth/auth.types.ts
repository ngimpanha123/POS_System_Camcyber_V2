// ================================================================>> Custom Library
import { User } from "../user/user.types";

export interface Login {

    access_token    : string,
    token_type      : string,
    expires_in      : string,
    user            : User,
    role            : string

}
