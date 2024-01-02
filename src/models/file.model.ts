import { BelongsTo, Model, Column, ForeignKey, Table, DataType } from 'sequelize-typescript';
import Type from './type.model';
import Extension from './extension.model';
import Folder from './folder.model';

@Table({ tableName: 'file', createdAt: 'created_at', updatedAt: 'updated_at' })
class File extends Model<File> {
    
    @ForeignKey(() => Folder)
    @Column({ onDelete: 'CASCADE' })
    folder_id: number;

    @ForeignKey(() => Type)
    @Column({ onDelete: 'CASCADE' })
    type_id: number;

    @ForeignKey(() => Extension)
    @Column({ onDelete: 'CASCADE' })
    extention_id: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    filename: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    originalname: string;

    @Column({ allowNull: false, type: DataType.STRING(150) })
    mimetype: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    uri: string;

    @Column({ allowNull: false, type: DataType.STRING(500) })
    path: string;

    @Column({ allowNull: false, type: DataType.INTEGER })
    size: number;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    encoding: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    is_uploaded_protected: boolean;

    @BelongsTo(() => Folder)
    folder: Folder;

    @BelongsTo(() => Type)
    type: Type;

    @BelongsTo(() => Extension)
    extenston: Extension;
}

export default File;