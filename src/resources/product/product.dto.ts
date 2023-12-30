import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsNumber()
    @IsPositive()
    type_id: number

    @IsNumber()
    @IsPositive()
    unit_price: number

    @IsString()
    @IsNotEmpty()
    image: string
}

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsNumber()
    @IsPositive()
    type_id: number

    @IsNumber()
    @IsPositive()
    unit_price: number

    @IsString()
    image?: string
}