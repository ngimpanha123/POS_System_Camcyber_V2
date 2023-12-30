import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import Product from 'src/models/product/product.model';
import ProductsType from 'src/models/product/type.model';
import { CreateProductTypeDto, UpdateProductTypeDto } from './type.dto';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ProductsTypeService {

    async listing(): Promise<{ data: { id: number, name: string, n_of_products: number }[] }> {
        const data = await ProductsType.findAll({
            attributes: [
                'id',
                'name',
                [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'n_of_products'],
            ],
            include: [
                {
                    model: Product,
                    attributes: [],
                },
            ],
            group: ['ProductsType.id'],
            order: [['name', 'ASC']],
        });

        const dataFormat = data.map(type => ({
            id: type.id,
            name: type.name,
            n_of_products: type?.get('n_of_products') || 0
        }));

        return {
            data: dataFormat as { id: number, name: string, n_of_products: number }[]
        };
    }

    async create(body: CreateProductTypeDto): Promise<{ data: ProductsType, message: string }> {
        const checkExistName = await ProductsType.findOne({
            where: { name: body.name }
        });
        if (checkExistName) {
            throw new BadRequestException('ឈ្មោះនេះមានក្នុងប្រព័ន្ធ')
        }
        const productType = await ProductsType.create({
            name: body.name
        });

        const dataFormat = {
            data: productType,
            message: 'Product type has been created.'
        } as { data: ProductsType, message: string };

        return dataFormat;
    }

    async update(body: UpdateProductTypeDto, id: number): Promise<{ data: ProductsType, message: string }> {
        const checkExist = await ProductsType.findByPk(id);
        if (!checkExist) {
            throw new BadRequestException('គ្មានទិន្នន័យនៅក្នុងប្រព័ន្ធ')
        }
        const checkExistName = await ProductsType.findOne({
            where: {
                id: { [Op.not]: id },
                name: body.name
            }
        });
        if (checkExistName) {
            throw new BadRequestException('ឈ្មោះនេះមានក្នុងប្រព័ន្ធ')
        }
        await ProductsType.update(body, {
            where: { id: id }
        });

        const dataFormat = {
            data: await ProductsType.findByPk(id, { attributes: ['id', 'name', 'updated_at'] }),
            message: 'Product type has been created.'
        } as { data: ProductsType, message: string };

        return dataFormat;
    }

    async delete(id: number): Promise<{ status_code: number, message: string }> {
        try {
            const rowsAffected = await Product.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected === 0) {
                throw new NotFoundException('Products type not found.');
            }

            return {
                status_code: HttpStatus.OK,
                message: 'Data has been deleted successfully.'
            };
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Something went wrong!. Please try again later.', 'Error Delete');
        }
    }
}
