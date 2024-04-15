// ================================================================>> Core Library
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// ================================================================>> Costom Library
import OrderDetails from 'src/models/order/detail.model';
import Order from 'src/models/order/order.model';
import Product from 'src/models/product/product.model';
import User from 'src/models/user/user.model';
import { JsReportService } from 'src/app/services/js-report.service';

@Injectable()
export class InvoiceService {
    constructor(private jsReportService: JsReportService) { }

    // Method to generate an invoice report
    async generateReport(receiptNumber: number) {
        // Retrieving orders related to the specified receipt number
        const orders = await Order.findAll({
            where: {
                receipt_number: receiptNumber,
            },
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
                            attributes: ['id', 'name', 'image'],
                        }
                    ]
                },
            ],
            order: [['id', 'DESC']],
        });

        // Handling case when no orders are found
        if (!orders || orders.length === 0) {
            throw new NotFoundException('Order not found');
        }

        // Calculating the total price of all orders
        let total = 0;
        orders.forEach((row) => {
            total += row.total_price;
        });

        // Structuring the data for the report
        const data = {
            total: total,
            data: orders,
        };

        // Get the report template
        const template = process.env.JS_TEMPLATE;

        try {
            // Generating the report using the JsReportService
            const result = await this.jsReportService.generateReport(template, data);
            if (result.error) {
                throw new BadRequestException(result.error);
            }
            // Returning the generated report
            return result;
        } catch (error) {
            // Log the error or handle it in a more appropriate way
            throw new BadRequestException(error?.message || 'Failed to generate the report');
        }
    }
}
