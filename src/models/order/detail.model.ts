import { Model, Column, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import Order from './order.model';
import Product from '../product/product.model';

@Table({ tableName: 'order_details', createdAt: 'created_at', updatedAt: 'updated_at' })
class OrderDetails extends Model<OrderDetails> {

    // ==========================================>> Foreign Key from Order Table 
    @ForeignKey(() => Order)
    @Column({ onDelete: 'CASCADE' })                                                                                    order_id: number;

    // ==========================================>> Foreign from Product Table
    @ForeignKey(() => Product)
    @Column({ onDelete: 'CASCADE' })                                                                                    product_id: number;

    // =========================================>> Flieds
    @Column({ allowNull: true, type: DataType.DOUBLE })                                                                 unit_price?: number;

    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })                                              qty: number;

    @BelongsTo(() => Order)                                                                                             orders: Order;

    @BelongsTo(() => Product) products: Product;
}

export default OrderDetails;