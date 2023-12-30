import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import Product from 'src/models/product/product.model';
import ProductsType from 'src/models/product/type.model';
import { CreateProductDto, UpdateProductDto } from './product.dto';


@Injectable()
export class ProductService {

    async listing(type_id?: number, key?: string, limit: number = 10, page: number = 1) {

        const offset = (page - 1) * limit;
        const where = {
            [Op.and]: [
                key
                    ? {
                        [Op.or]: [
                            { code: { [Op.iLike]: `%${key}%` } },
                            { name: { [Op.like]: `%${key}%` } },
                        ],
                    }
                    : {},
                type_id ? { type_id: Number(type_id) } : {}
            ]
        };
        const data = await Product.findAndCountAll({
            attributes: ['id', 'code', 'name', 'image', 'unit_price', 'created_at'],
            where: where,
            include: [
                {
                    model: ProductsType,
                    attributes: ['id', 'name']
                }
            ],
            order: [['id', 'DESC']],
            offset: offset,
            limit: limit,
        });
        const totalCount = data.count;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: data.rows,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalItems: totalCount,
                totalPages: totalPages
            }
        };
    }

    async create(body: CreateProductDto) {
        const checkExistCode = await Product.findOne({
            where: { code: body.code }
        });
        if (checkExistCode) {
            throw new BadRequestException('លេខកូដនេះមានក្នុងប្រព័ន្ធ')
        }
        const checkExistName = await Product.findOne({
            where: { name: body.name }
        });
        if (checkExistName) {
            throw new BadRequestException('ឈ្មោះនេះមានក្នុងប្រព័ន្ធ')
        }
        const product = await Product.create(body);
        return {
            product
        };
    }

    async update(body: UpdateProductDto, id: number) {

        const checkExist = await Product.findByPk(id);

        if (!checkExist) {
            throw new BadRequestException('គ្មានទិន្នន័យនៅក្នុងប្រព័ន្ធ')
        }

        const checkExistCode = await Product.findOne({
            where: {
                id: { [Op.not]: id },
                code: body.code
            }
        });
        if (checkExistCode) {
            throw new BadRequestException('លេខកូដនេះមានក្នុងប្រព័ន្ធ')
        }

        const checkExistName = await Product.findOne({
            where: {
                id: { [Op.not]: id },
                name: body.name
            }
        });
        if (checkExistName) {
            throw new BadRequestException('ឈ្មោះនេះមានក្នុងប្រព័ន្ធ')
        }

        await Product.update(body, {
            where: { id: id }
        });

        return await Product.findByPk(id);
    }

    async delete(id: number): Promise<{ status_code: number, message: string }> {
        try {
            const rowsAffected = await Product.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected === 0) {
                throw new NotFoundException('Product not found.');
            }

            return {
                status_code: HttpStatus.OK,
                message: 'This product has been deleted successfully.'
            };
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Something went wrong!. Please try again later.', 'Error Delete');
        }
    }

}
