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
    type_id?: number,
    code: string,
    name: string,
    image: string,
    unit_price: number,
    created_at: Date,
    type: { id: number, name: string }
}

