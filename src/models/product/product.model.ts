// ================================================================>> Third Party Library
import { Model, Column, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';

// ================================================================>> Costom Library
import ProductsType     from './type.model';

@Table({ tableName: 'product', createdAt: 'created_at', updatedAt: 'updated_at' })
class Product extends Model<Product> {
    @ForeignKey(() => ProductsType)
    @Column({ onDelete: 'RESTRICT' })
    type_id: number;

    @Column({ allowNull: false, unique: true, type: DataType.STRING(100) })
    code: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    name: string;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    image?: string;

    @Column({ allowNull: true, type: DataType.DOUBLE })
    unit_price?: number;

    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2), defaultValue: 0 })
    discount: number;

    @BelongsTo(() => ProductsType)
    type: ProductsType;
}

export default Product;