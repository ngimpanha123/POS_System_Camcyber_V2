import { BelongsTo, Model, Column, ForeignKey, Table, DataType, HasMany } from 'sequelize-typescript';
import Project from './project.model';
import File from './file.model';

@Table({ tableName: 'folder', createdAt: 'created_at', updatedAt: 'updated_at' })
class Folder extends Model<Folder> {
    @ForeignKey(() => Project)
    @Column({ onDelete: 'CASCADE' })
    project_id: number;

    @ForeignKey(() => Folder)
    @Column({ allowNull: true, onDelete: 'CASCADE' })
    parent_id: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    name: string;

    @BelongsTo(() => Project)
    project: Project;

    @BelongsTo(() => Folder)
    parent: Folder;

    @HasMany(() => File)
    files: File[]
}

export default Folder;