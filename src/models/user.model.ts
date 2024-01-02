import { Model, Column, Table, DataType } from 'sequelize-typescript';
import { UserType } from '../shared/enums/user.enum';

@Table({ tableName: 'user', createdAt: 'created_at', updatedAt: 'updated_at' })
class User extends Model<User> {

    @Column({ allowNull: true, type: DataType.STRING(100) })
    name: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    phone: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    password: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    avatar: string;

    @Column({
        allowNull: false,
        type: DataType.ENUM(...Object.values(UserType)),
        defaultValue: UserType.Admin,
    })
    type: UserType;
}

export default User;
