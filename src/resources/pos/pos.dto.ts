import { IsJSON, IsNotEmpty } from 'class-validator'

export class CreateOrderDto {
    @IsNotEmpty()
    @IsJSON()
    cart: string
}