export interface List {
    data: Data[],
    pagination: {
        current_page: number,
        per_page: number,
        total_items: number,
        total_pages: number
    }
}

export interface Data {
    id: number,
    receipt_number: number,
    total_price: number,
    created_at: Date,
    cashier: { id: number, name: string },
    details: Detail[]
}

export interface Detail {
    id: number,
    unit_price: number,
    qty: number,
    product: { id: number, name: string }
}

