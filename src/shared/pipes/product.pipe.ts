import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import ProductsType from 'src/models/product/type.model';

@Injectable()
export class ProductsTypeExistsPipe implements PipeTransform {

    async transform(value: any) {
        // Check if the 'type_id' exists in the value object and validate only for that property
        if (typeof value !== 'number' && 'type_id' in value) {
            const typeId = value.type_id;

            // Query the database to check if the products_type_id exists in the user_type table
            const type = await ProductsType.findByPk(typeId);

            if (!type) {
                throw new BadRequestException('Invalid type_id');
            }
        }

        // Return the value if it is valid
        return value;
    }
}
