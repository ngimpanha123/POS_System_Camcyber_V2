// ================================================================>> Costom Library
import ProductsType     from "../../models/product/type.model";
import Product          from "../../models/product/product.model";

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
            image: 'upload/file/5a3d9053-0885-4ea7-b4d2-0ef380874c06'

        },
        {
            code: 'B002',
            type_id: 4,
            name: 'Deep Cleaning Oil',
            unit_price: 15000,
            image: 'upload/file/0021737e-f060-4e83-81fd-a2dfee58b8f0'
        },
        {
            code: 'B003',
            type_id: 4,
            name: 'LipGloss',
            unit_price: 25000,
            image: 'upload/file/d58f8a69-8202-49f0-b194-4f67e39de57d'
        },
        {
            code: 'B004',
            type_id: 4,
            name: 'Dark Pot',
            unit_price: 18000,
            image: 'upload/file/9550b001-1f86-4b9a-bd77-ac11ad2978a9'
        },
        {
            code: 'B005',
            type_id: 4,
            name: 'Mauli',
            unit_price: 23000,
            image: 'upload/file/e1b0318e-e182-4d4c-9740-c25534fdacbc'
        },
        {
            code: 'S001',
            type_id: 1,
            name: 'Schoko',
            unit_price: 3000,
            image: 'upload/file/3dbe5ced-9dcc-4b6d-962d-6646a7dd4166'

        },
        {
            code: 'S002',
            type_id: 1,
            name: 'Cheez-it',
            unit_price: 5000,
            image: 'upload/file/b19f3d3c-5912-410f-b5ad-adf3e7ad6ea9'
        },
        {
            code: 'S003',
            type_id: 1,
            name: 'Chikki',
            unit_price: 2000,
            image: 'upload/file/c966922c-4920-4929-87b9-a29e6f692015'
        },
        {
            code: 'S004',
            type_id: 1,
            name: 'Snickers',
            unit_price: 4000,
            image: 'upload/file/81bed61b-c50f-4bc9-b626-1dce345758b7'
        },
        {
            code: 'S005',
            type_id: 1,
            name: 'Protein',
            unit_price: 5000,
            image: 'upload/file/ff0bd666-5127-482b-b35f-adb8d8cf6dba'
        },
        {
            code: 'M001',
            type_id: 2,
            name: 'Crab',
            unit_price: 10000,
            image: 'upload/file/6186ce49-8372-4bc0-b72b-ad5320f839c2'
        },
        {
            code: 'M002',
            type_id: 2,
            name: 'Jerky Beef',
            unit_price: 15000,
            image: 'upload/file/75425217-1b76-468a-897f-3222f19c789e'
        },
        {
            code: 'M003',
            type_id: 2,
            name: 'Clam',
            unit_price: 25000,
            image: 'upload/file/4fa03d02-85a2-4d4e-8e87-9feabd728a15'
        },
        {
            code: 'M004',
            type_id: 2,
            name: 'Chicken meat',
            unit_price: 15000,
            image: 'upload/file/0f362100-b8c7-480e-b660-44d1a5e65527'
        },
        {
            code: 'M005',
            type_id: 2,
            name: 'Beef',
            unit_price: 23000,
            image: 'upload/file/f8b548eb-ac68-4617-84ee-8e89104e90bb'
        },
        {
            code: 'Be001',
            type_id: 3,
            name: 'G',
            unit_price: 8000,
            image: 'upload/file/ba66decf-0f14-4165-b009-618bb6706612'

        },
        {
            code: 'Be002',
            type_id: 3,
            name: 'IZE',
            unit_price: 1500,
            image: 'upload/file/ad76f43f-ad01-4087-9df6-b5ee3c61dc00'
        },
        {
            code: 'Be003',
            type_id: 3,
            name: 'Creamsoda',
            unit_price: 12000,
            image: 'upload/file/d49a326f-e686-40c9-8c9e-0d306513a01b'
        },
        {
            code: 'Be004',
            type_id: 3,
            name: 'EGB',
            unit_price: 6000,
            image: 'upload/file/cc4a2951-601c-4301-9e8a-6b8309df8296'
        },
        {
            code: 'Be005',
            type_id: 3,
            name: 'Heineken',
            unit_price: 8000,
            image: 'upload/file/6fd14baf-1213-4811-ad33-140de2fc4b64'
        },
    ]
}