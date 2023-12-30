import { Injectable, NotFoundException } from '@nestjs/common';
import OrderDetails from 'src/models/order/detail.model';
import Order from 'src/models/order/order.model';
import Product from 'src/models/product/product.model';
import User from 'src/models/user/user.model';
import { JsReportService } from 'src/services/js-report.service';

@Injectable()
export class InvoiceService {
    constructor(private jsReportService: JsReportService) { }

    async generateReport(receiptNumber: number) {
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

        if (!orders || orders.length === 0) {
            throw new NotFoundException('Order not found');
        }

        let total = 0;
        orders.forEach((row) => {
            total += row.total_price;
        });

        const data = {
            total: total,
            data: orders,
        };

        const reportTemplate = {
            template: {
                name: '/invoice-pos/invoice-main',
            },
            data: data,
        };

        try {
            const base64Report = await this.jsReportService.generateReport(reportTemplate);
            return {
                file_base64: base64Report,
                error: null,
            };
        } catch (error) {
            // Log the error or handle it in a more appropriate way
            console.error('Failed to generate the report:', error);
            throw new Error('Failed to generate the report');
        }
    }
}
