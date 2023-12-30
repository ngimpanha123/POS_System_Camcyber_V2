import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import OrderDetails from 'src/models/order/detail.model';
import Order from 'src/models/order/order.model';
import Product from 'src/models/product/product.model';
import User from 'src/models/user/user.model';

interface GetSaleParams {
    receipt_number?: number;
    created_at?: {
        gte: Date;
        lte: Date;
    };
    cashier_id?: number;
}

@Injectable()
export class SaleService {
    async listing(filters: GetSaleParams, limit: number, page: number): Promise<any> {
        const offset = (page - 1) * limit;

        const whereClause: any = {};
        if (filters.receipt_number) {
            whereClause.receipt_number = filters.receipt_number;
        }
        if (filters.created_at) {
            whereClause.created_at = {
                [Op.between]: [filters.created_at.gte, filters.created_at.lte],
            };
        }

        const data = await Order.findAndCountAll({
            attributes: ['id', 'receipt_number', 'total_price', 'created_at'],
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
                {
                    model: OrderDetails,
                    attributes: ['id', 'unit_price', 'qty'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ],
            order: [['id', 'DESC']],
            offset: offset,
            limit: limit,
        });

        const totalCount = data.count;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: data.rows,
            currentPage: page,
            perPage: limit,
            total: totalCount,
            total_pages: totalPages,
        };
    }

    async delete(id: number): Promise<{ statusCode: number, message: string }> {
        try {
            const rowsAffected = await Product.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected === 0) {
                throw new NotFoundException('Sale record not found.');
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'This product has been deleted successfully.'
            };
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Something went wrong!. Please try again later.', 'Error Delete');
        }
    }
}
