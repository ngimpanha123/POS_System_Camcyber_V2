// ================================================================>> Third Party Library
import { Model, Column, Table, BelongsTo, ForeignKey, DataType, HasMany } from 'sequelize-typescript';

// ================================================================>> Costom Library
import User         from '../user/user.model';
import OrderDetails from './detail.model';

@Table({ tableName: 'order', createdAt: 'created_at', updatedAt: 'updated_at' })
class Order extends Model<Order> { 
    @ForeignKey(() => User)
    @Column({ onDelete: 'CASCADE' })
    cashier_id: number;

    @Column({ allowNull: false, unique: true, type: DataType.BIGINT })
    receipt_number: number;

    @Column({ allowNull: true, type: DataType.DOUBLE })
    total_price?: number;

    @Column({ allowNull: true, type: DataType.DATE, defaultValue: new Date() })
    ordered_at?: Date;

    @BelongsTo(() => User)
    cashier: User;

    @HasMany(() => OrderDetails) 
    details: OrderDetails
}

export default Order;