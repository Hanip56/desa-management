import axiosInstance from "@/lib/axiosConfig";
import axios from "axios";

// GET PENGAJUAN DIPROSES COUNT & LATEST
export interface RecordTypeGetPengajuanCountAndLatest {
  id: string;
  jenis: string;
  status: string;
  createdAt: string;
  link: string;
}

interface Results {
  totalDiproses: number;
  latestRecords: RecordTypeGetPengajuanCountAndLatest[];
}

export const getPengajuanCountAndLatest = async () => {
  try {
    const response = await axiosInstance.get<Results>(`/pengajuan/diproses`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
