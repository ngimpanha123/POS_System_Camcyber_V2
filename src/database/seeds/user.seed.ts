import { UserType } from "../../shared/enums/user.enum";

const userSeed = {
    users: [
        {
            name: 'Yim Klok',
            phone: '0977779688',
            password: '123456',
            avatar: 'api/file/serve/aa20ebcb-8b39-47f3-b536-b75eaad91b05',
            type: UserType.Developer
        }
    ]
}

export default userSeed;