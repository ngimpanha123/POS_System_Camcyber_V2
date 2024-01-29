// ================================================================ Core Library
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

// ================================================================ Third Party Library
import { Op } from 'sequelize';

// ================================================================ Costom Library
import Product from 'src/models/product/product.model';
import ProductsType from 'src/models/product/type.model';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {

    // Method to retrieve the setup data for product types
    async setup(): Promise<{ data: ProductsType[] }> {
        const setup = await ProductsType.findAll({ attributes: ['id', 'name'] });
        return {
            data: setup
        };
    }

    // Method to list products with optional filtering and pagination
    async listing(type_id?: number, key?: string, limit: number = 10, page: number = 1) {
        // Calculate offset for pagination
        const offset = (page - 1) * limit;
        
        // Define the WHERE condition based on provided parameters
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

        // Retrieve products with associated product types
        const data = await Product.findAll({
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

        // Calculate total count and total pages for pagination
        const totalCount = await Product.count();
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: data,
            pagination: {
                current_page: page,
                per_page: limit,
                total_items: totalCount,
                total_pages: totalPages
            }
        };
    }

    // Method to create a new product
    async create(body: CreateProductDto): Promise<{ data: Product, message: string }> {
        // Check if the product code already exists
        const checkExistCode = await Product.findOne({
            where: { code: body.code }
        });
        if (checkExistCode) {
            throw new BadRequestException('This code already exists in the system.');
        }

        // Check if the product name already exists
        const checkExistName = await Product.findOne({
            where: { name: body.name }
        });
        if (checkExistName) {
            throw new BadRequestException('This name already exists in the system.');
        }

        // Create the new product
        const product = await Product.create(body);

        return {
            data: product,
            message: 'Product has been created.'
        };
    }

    // Method to update an existing product
    async update(body: UpdateProductDto, id: number): Promise<{ data: Product, message: string }> {
        // Check if the product with the given ID exists
        const checkExist = await Product.findByPk(id);
        if (!checkExist) {
            throw new BadRequestException('No data found for the provided ID.');
        }

        // Check if the updated code already exists for another product
        const checkExistCode = await Product.findOne({
            where: {
                id: { [Op.not]: id },
                code: body.code
            }
        });
        if (checkExistCode) {
            throw new BadRequestException('This code already exists in the system.');
        }

        // Check if the updated name already exists for another product
        const checkExistName = await Product.findOne({
            where: {
                id: { [Op.not]: id },
                name: body.name
            }
        });
        if (checkExistName) {
            throw new BadRequestException('This name already exists in the system.');
        }

        // Update the product
        await Product.update(body, {
            where: { id: id }
        });

        // Retrieve and return the updated product
        return {
            data: await Product.findByPk(id),
            message: 'Product has been updated.'
        };
    }

    // Method to delete a product by ID
    async delete(id: number): Promise<{ status_code: number, message: string }> {
        try {
            // Attempt to delete the product
            const rowsAffected = await Product.destroy({
                where: {
                    id: id
                }
            });

            // Check if the product was found and deleted
            if (rowsAffected === 0) {
                throw new NotFoundException('Product not found.');
            }

            return {
                status_code: HttpStatus.OK,
                message: 'This product has been deleted successfully.'
            };
        } catch (error) {
            // Handle any errors during the delete operation
            throw new BadRequestException(error.message ?? 'Something went wrong! Please try again later.', 'Error Delete');
        }
    }

}
