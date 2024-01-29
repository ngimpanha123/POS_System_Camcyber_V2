// ================================================================>> Core Library
import { BadRequestException, Injectable } from '@nestjs/common';

// ================================================================>> Third Party Library
import { DatabaseError, Op } from 'sequelize';

// ================================================================>> Costom Library
import Order from 'src/models/order/order.model';

@Injectable()
export class DashboardService {

    // Method to retrieve dashboard information
    async getDashboardInfo(): Promise<{ data: { total_sale_today: number }, message: string }> {
        try {
            // Calculating total sale today using Sequelize's sum function
            const totalSaleToday = await Order.sum('total_price', {
                where: {
                    ordered_at: {
                        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)), // Today's date
                        [Op.lt]: new Date(new Date().setHours(24, 0, 0, 0)), // End of today
                    },
                },
            });

            // Creating a data object to structure the response
            const data = {
                data: {
                    total_sale_today: totalSaleToday || 0
                },
                message: 'success'
            }

            // Returning the structured data
            return data;
        } catch (error) {
            // Handling potential errors during the database query 
            //Comments on the error-handling section, which checks for specific database errors and throws a BadRequestException accordingly.
            if (error instanceof DatabaseError && error.message.includes('invalid identifier')) {
                throw new BadRequestException('Invalid select data or database error', 'Database Error');
            } else {
                throw new BadRequestException('Server database error', 'Database Error');
            }
        }
    }
}
