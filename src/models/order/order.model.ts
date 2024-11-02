import { Model, Column, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import User from '../user/user.model';

@Table({ tableName: 'order', createdAt: 'created_at', updatedAt: 'updated_at' })
class Order extends Model<Order> { 

    // =========================================>> Foreign Key from  User     
    @ForeignKey(() => User)
    @Column({ onDelete: 'CASCADE' })                                                                                    cashier_id: number;

    @Column({ allowNull: false, unique: true, type: DataType.BIGINT })                                                  receipt_number: number;

    @Column({ allowNull: true, type: DataType.DOUBLE })                                                                 total_price?: number;

    @Column({ allowNull: true, type: DataType.DATE, defaultValue: new Date() })                                         ordered_at?: Date;

    @BelongsTo(() => User) cashiers: User;
}

export default Order;