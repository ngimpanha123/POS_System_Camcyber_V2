import User from "../../models/user.model"

export default interface UserPayload {
    user: User
    iat: number
    exp: number
}