// =========================================================================>> Custom Library
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

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

    @IsOptional()
    @IsString()
    image: string
}

// @IsString(): Ensures that the property is a string.
// @IsNotEmpty(): Requires that the property is not empty.
// @IsNumber(): Requires that the property is a number.
// @IsPositive(): Requires that the property is a positive number.
// @IsOptional(): Marks the property as optional.