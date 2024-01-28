// Interface representing a list with a 'data' property
export interface List {

    data   : Data
}

// Interface representing data related to sales and product statistics
export interface Data {
    
    total_sale_today    : number,
    total_products      : number,
    total_in_stock      : number,
    total_out_stock     : number,
    total_users         : number,
    total_sales         : number,
}
