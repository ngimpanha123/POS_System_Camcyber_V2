import { Model, Column, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import ProductsType from './type.model';

@Table({ tableName: 'product', createdAt: 'created_at', updatedAt: 'updated_at' })
class Product extends Model<Product> {

    // =============================================== >> Foreign Key from product type
    @ForeignKey(() => ProductsType)
    @Column({ onDelete: 'CASCADE' })                                                                                    type_id: number;

    // =============================================== >> Flieds

    @Column({ allowNull: false, unique: true, type: DataType.STRING(100) })                                             code: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })                                                           name: string;

    @Column({ allowNull: true, type: DataType.STRING(100) })                                                            image?: string;

    @Column({ allowNull: true, type: DataType.DOUBLE })                                                                 unit_price?: number;

    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2), defaultValue: 0 })                                       discount: number;

    @BelongsTo(() => ProductsType) type: ProductsType;
}

export default Product;