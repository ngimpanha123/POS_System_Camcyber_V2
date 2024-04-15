// ================================================================>> Third Party Library
import * as bcrypt from 'bcryptjs';

// ================================================================>> Costom Library
import { UsersActiveEnum }  from "../../app/enums/user/active.enum";
import { UsersTypeEnum }    from "../../app/enums/user/type.enum";
import UsersType            from "../../models/user/type.model";
import User                 from "../../models/user/user.model";


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
            type_id     : UsersTypeEnum.Admin,
            name        : 'Yim Klok',
            avatar      : 'static/pos/user/avatar.png',
            email       : 'yimklok.kh@gmail.com',
            phone       : '0977779688',
            password    : '123456',
            is_active   : UsersActiveEnum.Active
        },
        {
            type_id     : UsersTypeEnum.Staff,
            name        : 'Heng MeyMey',
            avatar      : 'static/pos/user/avatar.png',
            email       : 'hengmeymey@gmail.com',
            phone       : '0979688777',
            password    : '123456',
            is_active   : UsersActiveEnum.Active
        }
    ]
}