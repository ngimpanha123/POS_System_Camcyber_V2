// ================================================================>> Third Party Library
import { Model, Column, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';

// ================================================================>> Costom Library
import UsersType from './type.model';
import { UsersActiveEnum } from '../../enums/user/active.enum';

@Table({ tableName: 'user', createdAt: 'created_at', updatedAt: 'updated_at' })
class User extends Model<User> {
    /** @noted id is auto create by sequelize, so we can delete it from here it you want. */
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => UsersType)
    @Column({ onDelete: 'CASCADE' })
    type_id: number;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    name: string;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    avatar: string;

    @Column({ allowNull: true, unique: true, type: DataType.STRING(100) })
    email: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    phone: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    password: string;

    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: UsersActiveEnum.Active })
    is_active: UsersActiveEnum;

    @Column({ allowNull: true, type: DataType.INTEGER })
    creator_id?: number

    @Column({ allowNull: true, type: DataType.INTEGER })
    updater_id?: number

    @Column({ allowNull: true, type: DataType.INTEGER })
    deleter_id?: number

    @BelongsTo(() => UsersType)
    type: UsersType;
}

export default User;