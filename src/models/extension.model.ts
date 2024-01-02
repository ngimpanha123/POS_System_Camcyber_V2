import { Model, Column, ForeignKey, Table, HasMany, DataType, BelongsTo } from 'sequelize-typescript';
import Type from './type.model';
import File from './file.model';

@Table({ tableName: 'extension', createdAt: 'created_at', updatedAt: 'updated_at' })
class Extension extends Model<Extension> {
    @ForeignKey(() => Type)
    @Column({ onDelete: 'CASCADE' })
    type_id: number;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    name: string;

    @Column({ allowNull: false, type: DataType.STRING(150) })
    fullname: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    icon: string;

    @BelongsTo(() => Type)
    type: Type;

    @HasMany(() => File)
    files: File[];
}

export default Extension;