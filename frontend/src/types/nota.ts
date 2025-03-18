export interface Nota {
    id: number,
    no_nota: string,
    tanggal: string,
    pembeli: string,
    alamat: string,
    total_harga: number,
    total_coly: number,
    jt_tempo: string,
    status: number
}

export interface Pagination {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }

export interface NotaResponse {
    data: Nota[],
    pagination: Pagination,
}