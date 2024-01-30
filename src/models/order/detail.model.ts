
// ================================================================>> Third Party Library
import { Model, Column, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';

// ================================================================>> Costom Library
import Order        from './order.model';
import Product      from '../product/product.model';

@Table({ tableName: 'order_details', createdAt: 'created_at', updatedAt: 'updated_at' })
class OrderDetails extends Model<OrderDetails> {
    @ForeignKey(() => Order)
    @Column({ onDelete: 'CASCADE' })
    order_id: number;

    @ForeignKey(() => Product)
    @Column({ onDelete: 'CASCADE' })
    product_id: number;

    @Column({ allowNull: true, type: DataType.DOUBLE })
    unit_price?: number;

    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })
    qty: number;

    @BelongsTo(() => Order)
    order: Order;

    @BelongsTo(() => Product)
    product: Product;
}

export default OrderDetails;