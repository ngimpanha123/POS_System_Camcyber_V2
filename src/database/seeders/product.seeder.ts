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
            image: 'file/serve/d5a429e2-d1d5-492b-abaa-4691b9b2e8ce'

        },
        {
            code: 'B002',
            type_id: 4,
            name: 'Deep Cleaning Oil',
            unit_price: 15000,
            image: 'file/serve/c272bcf6-9002-40f6-b709-0c18d5bced99'
        },
        {
            code: 'B003',
            type_id: 4,
            name: 'LipGloss',
            unit_price: 25000,
            image: 'file/serve/5a086067-54e2-4cb1-bc2d-fbbe129b1f46'
        },
        {
            code: 'B004',
            type_id: 4,
            name: 'Dark Pot',
            unit_price: 18000,
            image: 'file/serve/0c378479-02a1-4b04-a938-f3fe0a3c44e1'
        },
        {
            code: 'B005',
            type_id: 4,
            name: 'Mauli',
            unit_price: 23000,
            image: 'file/serve/18264bbf-6250-4183-9428-c2383cb6aeef'
        },
        {
            code: 'S001',
            type_id: 1,
            name: 'Schoko',
            unit_price: 3000,
            image: 'file/serve/ea2aee6c-a477-4be6-87cc-d64776200722'

        },
        {
            code: 'S002',
            type_id: 1,
            name: 'Cheez-it',
            unit_price: 5000,
            image: 'file/serve/8d1aa10f-1948-4976-b902-8b37afb88f6f'
        },
        {
            code: 'S003',
            type_id: 1,
            name: 'Chikki',
            unit_price: 2000,
            image: 'file/serve/69c47e9f-ecfc-48eb-99d8-9df3dd2e3040'
        },
        {
            code: 'S004',
            type_id: 1,
            name: 'Snickers',
            unit_price: 4000,
            image: 'file/serve/f22754a6-d311-489b-a2b5-639cd9bc1672'
        },
        {
            code: 'S005',
            type_id: 1,
            name: 'Protein',
            unit_price: 5000,
            image: 'file/serve/09d8c5f5-08f2-4d35-8097-c4110db1ded3'
        },
        {
            code: 'M001',
            type_id: 2,
            name: 'Crab',
            unit_price: 10000,
            image: 'file/serve/b5ad804a-6e09-43d4-b982-d66bb575485a'
        },
        {
            code: 'M002',
            type_id: 2,
            name: 'Jerky Beef',
            unit_price: 15000,
            image: 'file/serve/f8e899f7-884e-4acb-b12c-3408cbdd1e3d'
        },
        {
            code: 'M003',
            type_id: 2,
            name: 'Clam',
            unit_price: 25000,
            image: 'file/serve/89ef93ac-17b4-4277-96e3-2f71134ef3df'
        },
        {
            code: 'M004',
            type_id: 2,
            name: 'Chicken meat',
            unit_price: 15000,
            image: 'file/serve/1c948ec2-ed21-44ca-b12e-979f30722d50'
        },
        {
            code: 'M005',
            type_id: 2,
            name: 'Beef',
            unit_price: 23000,
            image: 'file/serve/66f6c269-65fc-4f95-a2bc-22c5112a733b'
        },
        {
            code: 'Be001',
            type_id: 3,
            name: 'G',
            unit_price: 8000,
            image: 'file/serve/f7b8702f-b241-4c35-8382-ae8bc9f3c926'

        },
        {
            code: 'Be002',
            type_id: 3,
            name: 'IZE',
            unit_price: 1500,
            image: 'file/serve/a6d8aba7-87c7-4334-9a8d-bbdd769655b6'
        },
        {
            code: 'Be003',
            type_id: 3,
            name: 'Creamsoda',
            unit_price: 12000,
            image: 'file/serve/627a14e1-e4b5-4677-847f-f8297ac0be47'
        },
        {
            code: 'Be004',
            type_id: 3,
            name: 'EGB',
            unit_price: 6000,
            image: 'file/serve/de8ee2b1-8e19-4a56-8c03-59d3feb07316'
        },
        {
            code: 'Be005',
            type_id: 3,
            name: 'Heineken',
            unit_price: 8000,
            image: 'file/serve/b6b35193-0399-4e3a-bd83-f97acf59725a'
        },
    ]
}