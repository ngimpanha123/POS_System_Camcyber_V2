import { UsersActiveEnum } from "../../enums/user/active.enum";
import { UsersTypeEnum } from "../../enums/user/type.enum";
import * as bcrypt from 'bcryptjs';
import UsersType from "../../models/user/type.model";
import User from "../../models/user/user.model";

export class UserSeeder {

    seed = async () => {

        try {
            await UsersType.bulkCreate(userSeeder.types);
            console.log('\x1b[32m\nSeed users_type inserted successfully.');
        } catch (error) {
            console.error('Error seeding orders:', error);
        }
        // Hash passwords before creating users
        for (const userData of userSeeder.users) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        try {
            await User.bulkCreate(userSeeder.users);
            console.log('\x1b[32mSeed user inserted successfully.');
        } catch (error) {
            console.error('Error seeding orders:', error);
        }
    }
}

// Mock-data
const userSeeder = {
    types: [
        { name: 'Admin' },
        { name: 'Staff' }
    ],
    users: [
        {
            type_id: UsersTypeEnum.Admin,
            name: 'Yim Klok',
            avatar: 'static/icon/user.png',
            email: 'yimklok.kh@gmail.com',
            phone: '0977779688',
            password: '123456',
            is_active: UsersActiveEnum.Active,
            creator_id: null,
            updater_id: null,
            deleter_id: null
        },
        {
            type_id: UsersTypeEnum.Staff,
            email: 'hengmeymey@gmail.com',
            phone: '0979688777',
            password: '123456',
            is_active: UsersActiveEnum.Active,
            name: 'Heng MeyMey',
            avatar: 'static/icon/user.png'
        }
    ]
}