export interface DetailNota {
    id: number,
    notaId: number,
    nama_barang: string,
    coly: number,
    qty_isi: number,
    nama_isi: string,
    jumlah: number,
    harga: number,
    total: number
}

export interface Pagination {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

export interface DetailNotaResponse {
    data: DetailNota[],
    pagination: Pagination,
}