import Product from "../../models/product/product.model";
import OrderDetails from "../../models/order/detail.model";
import Order from "../../models/order/order.model";

export class OrderSeeder {

    seed = async () => {
        const data: {
            receipt_number: number;
            total_price?: number | null;
            ordered_at?: Date | null;
            cashier_id: number;
        }[] = [];

        for (let i = 1; i <= 100; i++) {
            const order = await Order.findByPk(i);
            if (order) await order.destroy();
            const receipt_number = await this.generateReceiptNumber();
            data.push({
                receipt_number,
                cashier_id: Math.floor(Math.random() * (2 - 1) + 1), //Math.floor(Math.random()*(max-min)+min) is min to max
                total_price: 0,
                ordered_at: new Date()
            });
        }

        try {
            await Order.bulkCreate(data);
            console.log('\x1b[32mSeed orders inserted successfully.');
        } catch (error) {
            console.error('Error seeding orders:', error);
        }

        const orders = await Order.findAll();
        for (const order of orders) {
            const details: {
                order_id: number;
                product_id: number;
                unit_price?: number | null;
                qty?: number | null;
            }[] = [];
            let total_price = 0;
            const nOfDetails = Math.floor(Math.random() * (7 - 2 + 1) + 2); //Math.floor(Math.random()*(max-min+1)+min) is 2 to 7

            for (let i = 1; i <= nOfDetails; i++) {
                const randomProductId = Math.floor(Math.random() * (20 - 1) + 1);
                const product = await Product.findOne({
                    where: { id: randomProductId },
                });

                if (!product) {
                    // Handle the case where the product is not found.
                    console.error(`Product with id ${randomProductId} not found.`);
                    continue; // Skip to the next iteration
                }

                const qty = Math.floor(Math.random() * 10) + 1;
                total_price += product.unit_price * qty;

                details.push({
                    order_id: order.id,
                    product_id: product.id,
                    unit_price: product.unit_price,
                    qty: qty,
                });
            }

            await OrderDetails.bulkCreate(details);

            await order.update({
                total_price,
            });
        }
        console.log('\x1b[32mSeed order_details inserted successfully.');
    }

    private generateReceiptNumber = async () => {
        const number: number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const check = await Order.findOne({
            where: {
                receipt_number: number,
            },
        });
        if (check) {
            return this.generateReceiptNumber();
        }
        return number;
    }
}
