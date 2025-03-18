import axios from "axios";
import { Nota } from "@/types/nota";
import { DetailNota } from "@/types/detailNota";

const BASE_URL = "http://localhost:3000"

export const getAllNota = async (): Promise<(Nota[])> => {
    const {data} = await axios.get(`${BASE_URL}/`);
    return data.payload.datas;
}

export const createNota = async () => {
    const {data} = await axios.post(`${BASE_URL}/nota`);
    return data.payload.datas;
}

export const updateNota = async (id: number, nota: Nota) => {
    const {data} = await axios.put(`${BASE_URL}/nota/${id}`, nota)
    return data.payload.data;
}

export const deleteNota = async (id: number) => {
    const {data} = await axios.put(`${BASE_URL}/nota/${id}/status`)
    return data.payload.datas;
}

export const getAllDetailNota = async (notaId: number): Promise<DetailNota[]> => {
    const {data} = await axios.get(`${BASE_URL}/detail-nota/${notaId}`)
    return data.payload.datas;
}

// Create a new detail nota
export const createDetailNota = async (detailNota: DetailNota) => {
    const { data } = await axios.post(`${BASE_URL}/detail-nota`, detailNota);
    return data.payload.datas;
};
  
  
// Update an existing detail nota
export const updateDetailNota = async (id: number, nota_id: number, detailNota: DetailNota) => {
   const { data } = await axios.put(`${BASE_URL}/detail-nota/${id}`, {
      ...detailNota,
      nota_id,
    });
    return data.payload.datas;
};
  
  
// Delete (soft-delete) a detail nota by changing its status to 0
export const deleteDetailNota = async (id: number) => {
    const { data } = await axios.put(`${BASE_URL}/detail-nota/${id}/status`);
    return data.payload.datas;
};