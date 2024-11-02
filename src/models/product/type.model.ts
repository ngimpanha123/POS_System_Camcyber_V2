import { Model, Column, Table, HasMany, DataType } from 'sequelize-typescript';
import Product from './product.model';

@Table({ tableName: 'products_type', createdAt: 'created_at', updatedAt: 'updated_at' })
class ProductsType extends Model<ProductsType> {
    
    @Column({ allowNull: false, type: DataType.STRING(100) })                                                           name: string;
    
    @HasMany(() => Product) products: Product[];
}

export default ProductsType;