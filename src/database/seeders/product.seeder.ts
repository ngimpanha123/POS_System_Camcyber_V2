import ProductsType from "../../models/product/type.model";
import Product from "../../models/product/product.model";

export class ProductSeeder {

    seed = async () => {

        try {
            await ProductsType.bulkCreate(productSeeder.types);
            console.log('\x1b[32mSeed products_typ inserted successfully.');
        } catch (error) {
            console.error('Error seeding orders:', error);
        }

        try {
            await Product.bulkCreate(productSeeder.products);
            console.log('\x1b[32mSeed product inserted successfully.');
        } catch (error) {
            console.error('Error seeding orders:', error);
        }
    }
}

// Mock-data
const productSeeder = {
    types: [
        { name: 'Snack' },
        { name: 'Food-Meat' },
        { name: 'Beverage' },
        { name: 'Beauty' }
    ],
    products: [
        {
            code: 'B001',
            type_id: 4,
            name: 'Boscia',
            unit_price: 10000,
            image: 'static/pos/Products/Beauty/boscia.jpg'

        },
        {
            code: 'B002',
            type_id: 4,
            name: 'Deep Cleaning Oil',
            unit_price: 15000,
            image: 'static/pos/Products/Beauty/deep-cleansing-oil.jpg'
        },
        {
            code: 'B003',
            type_id: 4,
            name: 'LipGloss',
            unit_price: 25000,
            image: 'static/pos/Products/Beauty/lipgloss.jpg'
        },
        {
            code: 'B004',
            type_id: 4,
            name: 'Dark Pot',
            unit_price: 18000,
            image: 'static/pos/Products/Beauty/dark-spot.jpg'
        },
        {
            code: 'B005',
            type_id: 4,
            name: 'Mauli',
            unit_price: 23000,
            image: 'tatic/Products/Beauty/mauli.jpg'
        },
        {
            code: 'S001',
            type_id: 1,
            name: 'Schoko',
            unit_price: 3000,
            image: 'static/pos/Products/Snack/milch-schoko.png'

        },
        {
            code: 'S002',
            type_id: 1,
            name: 'Cheez-it',
            unit_price: 5000,
            image: 'static/pos/Products/Snack/cheezit.pn'
        },
        {
            code: 'S003',
            type_id: 1,
            name: 'Chikki',
            unit_price: 2000,
            image: 'static/pos/Products/Snack/chikki.png'
        },
        {
            code: 'S004',
            type_id: 1,
            name: 'Snickers',
            unit_price: 4000,
            image: 'static/pos/Products/Snack/snickers.jpg'
        },
        {
            code: 'S005',
            type_id: 1,
            name: 'Protein',
            unit_price: 5000,
            image: 'static/pos/Products/Snack/protein-snack.jpg'
        },
        {
            code: 'M001',
            type_id: 2,
            name: 'Crab',
            unit_price: 10000,
            image: 'static/pos/Products/Food-Meat/crab.jpg'
        },
        {
            code: 'M002',
            type_id: 2,
            name: 'Jerky Beef',
            unit_price: 15000,
            image: 'static/pos/Products/Food-Meat/jerky-beef.jpg'
        },
        {
            code: 'M003',
            type_id: 2,
            name: 'Clam',
            unit_price: 25000,
            image: 'static/pos/Products/Food-Meat/clam.jpg'
        },
        {
            code: 'M004',
            type_id: 2,
            name: 'Chicken meat',
            unit_price: 15000,
            image: 'static/pos/Products/Food-Meat/chicken-meat.png'
        },
        {
            code: 'M005',
            type_id: 2,
            name: 'Beef',
            unit_price: 23000,
            image: 'static/pos/Products/Food-Meat/beef.png'
        },
        {
            code: 'Be001',
            type_id: 3,
            name: 'G',
            unit_price: 8000,
            image: 'static/pos/Products/Beverage/g.jpg'

        },
        {
            code: 'Be002',
            type_id: 3,
            name: 'IZE',
            unit_price: 1500,
            image: 'static/pos/Products/Beverage/ize.png'
        },
        {
            code: 'Be003',
            type_id: 3,
            name: 'Creamsoda',
            unit_price: 12000,
            image: 'static/pos/Products/Beverage/creamsoda.png'
        },
        {
            code: 'Be004',
            type_id: 3,
            name: 'EGB',
            unit_price: 6000,
            image: 'static/pos/Products/Beverage/egb.png'
        },
        {
            code: 'Be005',
            type_id: 3,
            name: 'Heineken',
            unit_price: 8000,
            image: 'static/pos/Products/Beverage/heineken.jpg'
        },
    ]
}