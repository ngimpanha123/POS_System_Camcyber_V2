import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import UsersType from 'src/models/user/type.model';

@Injectable()
export class UsersTypeExistsPipe implements PipeTransform {
    async transform(value: any) {
        // Check if the 'type_id' exists in the value object and validate only for that property
        if (typeof value === 'object' && 'type_id' in value) {

            const usersTypeId = value.type_id;

            // Query the database to check if the user_type_id exists in the user_role table
            const usersType = await UsersType.findOne({
                where: { id: usersTypeId }
            });

            if (!usersType) {
                throw new BadRequestException(`Invalid type_id value: ${usersTypeId}`);
            }
        }

        // Return the value if it is valid
        return value;
    }
}
