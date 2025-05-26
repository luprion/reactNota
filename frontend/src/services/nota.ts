import { Nota } from "@/types/nota";
import { DetailNota } from "@/types/detailNota";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

export const getAllNota = async (): Promise<(Nota[])> => {
    const {data} = await axios.get(`${BASE_URL}/`);
    return data.payload.datas;
}

export const getAllDetailNota = async (notaId: number): Promise<DetailNota[]> => {
    const {data} = await axios.get(`${BASE_URL}/detail-nota/${notaId}`)
    return data.payload.datas;
}
