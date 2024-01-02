import { Model, Column, Table, HasMany, DataType } from 'sequelize-typescript';
import Folder from './folder.model';

@Table({ tableName: 'project', createdAt: 'created_at', updatedAt: 'updated_at' })
class Project extends Model<Project> {
    @Column({ allowNull: false, type: DataType.STRING(100) })
    name: string;

    @Column({ allowNull: false, unique: true, type: DataType.STRING(50) })
    abbre: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    icon: string;

    @Column({ allowNull: false, unique: true, type: DataType.STRING(150) })
    secret: string;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    authorized_ip: string;

    @HasMany(() => Folder)
    folders: Folder[];
}

export default Project;