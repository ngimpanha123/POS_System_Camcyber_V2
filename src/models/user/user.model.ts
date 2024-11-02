import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { UsersActiveEnum } from "../../enums/user/active.enum";
import UsersType from "./type.model";

@ Table({ tableName: 'user', createdAt: 'created_at', updatedAt: 'updated_at'})
class User extends Model<User> {

    // =====================================================================>> Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                                                 id: number ;

    // =====================================================================>> Foreign Key from table User
    @ForeignKey(() => UsersType)
    @Column({ onDelete: 'CASCADE'})                                                                                     type_id: number ;

    // ====================================================================>> Field

    @Column({ allowNull: false, type: DataType.STRING(100)})                                                            name: string ;

    @Column({ allowNull: true, type: DataType.STRING(100) })                                                            avatar: string;

    @Column({ allowNull: true, unique: true, type: DataType.STRING(100) })                                              email: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })                                                           phone: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })                                                           password: string;

    //   ========================= This is the file boolean  0 or 1 active users  ===========>
    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: UsersActiveEnum.Active })     is_active: UsersActiveEnum;

    @Column({ allowNull: true, type: DataType.INTEGER })                                                                creator_id?: number

    @Column({ allowNull: true, type: DataType.INTEGER })                                                                updater_id?: number

    @Column({ allowNull: true, type: DataType.INTEGER })                                                                deleter_id?: number

    @BelongsTo(() => UsersType) type: UsersType ;
}

export default User ;
