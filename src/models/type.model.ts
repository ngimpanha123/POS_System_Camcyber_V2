import { Model, Column, Table, HasMany, DataType } from 'sequelize-typescript';
import File from './file.model';

@Table({ tableName: 'type', createdAt: 'created_at', updatedAt: 'updated_at' })
class Type extends Model<Type> {
 
    @Column({ allowNull: false, type: DataType.STRING(100) })
    name: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    icon: string;

    @HasMany(() => File)
    files: File[];
}

export default Type;