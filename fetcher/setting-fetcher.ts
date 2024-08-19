import axiosInstance from "@/lib/axiosConfig";
import { Setting } from "@prisma/client";
import axios from "axios";

export const updateSetting = async ({
  namaKepalaDesa,
  tte,
}: {
  namaKepalaDesa?: string;
  tte?: File;
}) => {
  try {
    const formData = new FormData();
    if (namaKepalaDesa) {
      formData.append("namaKepalaDesa", namaKepalaDesa);
    }
    if (tte) {
      formData.append("tte", tte);
    }

    const response = await axiosInstance.put<Setting>(`/setting`, formData);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
