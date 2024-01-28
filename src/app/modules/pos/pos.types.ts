// ================================================================>> Custom Library
import { Data as DataSale } from "../sale/sale.types"

export interface List {
    data: Data[]
}

export interface Data {
    id: number,
    name: string,
    products: Product[],
}

export interface Product {
    id: number,
    name: string,
    image: string,
    unit_price: number
}

export interface ResponseOrder {
    data: DataSale,
    message: string
}
