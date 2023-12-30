import { BadRequestException, Injectable } from '@nestjs/common';
import ProductsType from 'src/models/product/type.model';
import Product from 'src/models/product/product.model';
import Order from 'src/models/order/order.model';
import { CreateOrderDto } from './pos.dto';
import sequelizeConfig from 'src/config/sequelize.config';
import { Sequelize, Transaction } from 'sequelize';
import OrderDetails from 'src/models/order/detail.model';
import User from 'src/models/user/user.model';
import { TelegramService } from 'src/services/telegram.service';

@Injectable()
export class PosService {

    constructor(private telegramService: TelegramService) { };

    async getProducts() {
        const data = await ProductsType.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'image', 'unit_price'],
                },
            ],
            order: [['name', 'ASC']],
        });

        return data;
    }

    async makeOrder(cashierId: number, body: CreateOrderDto) {

        const sequelize = new Sequelize(sequelizeConfig);
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            const order = await Order.create({
                cashier_id: cashierId,
                total_price: 0,
                receipt_number: await this.generateReceiptNumber(),
                ordered_at: null,
            }, { transaction });

            let totalPrice = 0;
            const cartItems = JSON.parse(body.cart);

            for (const [productId, qty] of Object.entries(cartItems)) {
                const product = await Product.findByPk(parseInt(productId));

                if (product) {
                    totalPrice += Number(qty) * product.unit_price;
                    await OrderDetails.create({
                        order_id: order.id,
                        product_id: product.id,
                        qty: Number(qty),
                        unit_price: product.unit_price
                    }, { transaction });
                }
            }

            await Order.update(
                {
                    total_price: totalPrice,
                    ordered_at: new Date()
                },
                {
                    where: {
                        id: order.id,
                    },
                    transaction,
                }
            );

            const data: Order = await Order.findByPk(order.id, {
                attributes: ['id', 'receipt_number', 'total_price', 'ordered_at'],
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
                            }
                        ]
                    },
                ],
                transaction,
            });

            await transaction.commit();

            // Send Notification
            let htmlMessage = `<b>ការបញ្ជាទិញទទួលបានជោគជ័យ!</b>\n`;
            htmlMessage += `-លេខវិកយប័ត្រ៖ ${data.receipt_number}\n`;
            htmlMessage += `-អ្នកគិតលុយ៖ ${data.cashier?.name || ''}\n`;
            htmlMessage += `-កាលបរិច្ឆេទ: ${data.ordered_at ? new Date(data.ordered_at).toLocaleString() : ''}\n`;
            htmlMessage += `-From NestJS API`;
            await this.telegramService.sendHTMLMessage(htmlMessage);

            return {
                order: data,
                message: 'ការបញ្ជាទិញត្រូវបានបង្កើតដោយជោគជ័យ។',
            };
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }

            // Handle specific errors, if needed
            console.error('Error during order creation:', error);

            throw new BadRequestException('Something went wrong!. Please try again later.', 'Error during order creation.');
        }

    }

    private async generateReceiptNumber(): Promise<number> {
        const number = Math.floor(Math.random() * 9000000) + 1000000;
        return await Order.findOne({
            where: {
                receipt_number: number,
            },
        }).then((order) => {
            if (order) {
                return this.generateReceiptNumber();
            }
            return number;
        });
    }
}
