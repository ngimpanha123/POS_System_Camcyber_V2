// ================================================================>> Third Party Library
import { Model, Column, Table, HasMany, DataType } from 'sequelize-typescript';

// ================================================================>> Costom Library
import User from './user.model';

@Table({ tableName: 'users_type', createdAt: 'created_at', updatedAt: 'updated_at' })
class UsersType extends Model<UsersType> {
    @Column({ allowNull: false, type: DataType.STRING(100) })
    name: string;

    @HasMany(() => User)
    users: User[];
}

export default UsersType;