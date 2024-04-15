import User from "src/models/user/user.model"

export default interface UserPayload {
    user: User,
    role: string,
    iat: number
    exp: number
}