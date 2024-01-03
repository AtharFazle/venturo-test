export type Item = {
    id: number;
    nama: string;
    harga: number;
    tipe: string;
    gambar: string;
    quantity:number | 1;
}

export type MenuApiResponse = {
    status_code: number;
    datas: Item[];
}

export type Voucher = {
    id: number;
    kode: string;
    gambar: string;
    nominal: number;
    status: "aktif" | "non_aktif"; // Assuming status can only be "aktif" or "non_aktif"
    created_at: string;
    updated_at: string;
};

export type VouchersApiResponse = {
    status_code: number;
    datas: Voucher[];
};

export type ItemLastOrder = {
    id: number;
    harga: number;
    catatan: string ;
    quantity: number | 1;
};

export type Order = {
    voucher_id?:number;
    nominal_diskon: number;
    nominal_pesanan: number;
    items: ItemLastOrder[];
};

