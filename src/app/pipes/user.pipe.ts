// ================================================================>> Core Library
import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

// ================================================================>> Costom Library
import UsersType from 'src/models/user/type.model';

@Injectable()
export class UsersTypeExistsPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body' && value?.type_id) {
            const usersTypeId = value.type_id;
            // Query the database to check if the user_type_id exists in the user_role table
            const usersType = await UsersType.findByPk(usersTypeId);
            if (!usersType) {
                throw new BadRequestException(`Invalid type_id value: ${usersTypeId}`);
            }
        }
        // Return the value if it is valid
        return value;
    }
}
