import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseError, Op } from 'sequelize';
import Order from 'src/models/order/order.model';

@Injectable()
export class DashboardService {

    async getDashboardInfo(): Promise<{ data: { total_sale_today: number }, message: string }> {
        try {
            const totalSaleToday = await Order.sum('total_price', {
                where: {
                    ordered_at: {
                        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)), // Today's date
                        [Op.lt]: new Date(new Date().setHours(24, 0, 0, 0)), // End of today
                    },
                },
            });
            const data = {
                data: {
                    total_sale_today: totalSaleToday || 0
                },
                message: 'success'
            }
            return data;
        } catch (error) {
            if (error instanceof DatabaseError && error.message.includes('invalid identifier')) {
                throw new BadRequestException('Invalid select data or database error', 'Database Error');
            } else {
                throw new BadRequestException('Server database error', 'Database Error');
            }
        }
    }
}
