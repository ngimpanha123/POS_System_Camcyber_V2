// ================================================================>> Costom Library
import Order from "src/models/order/order.model";
import { Pagination } from "src/shared/pagination.interface";

export interface List {
    data: Order[],
    pagination: Pagination
}