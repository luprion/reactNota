import { DetailNota } from "./detailNota";

export interface Nota {
    id: number,
    no_nota: string,
    tanggal: string,
    pembeli: string,
    alamat: string,
    subtotal: number;
    diskon_persen: number;
    diskon_rupiah: number;
    total_harga: number,
    total_coly: number,
    jt_tempo: string,
    details: DetailNota[],
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