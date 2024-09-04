import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SuratRekomendasiPembelianBbm } from "@prisma/client";
import { SuratRekomendasiPembelianBbmWithUser } from "@/types";

type SuratRekomendasiPembelianBbmForDB = Omit<
  SuratRekomendasiPembelianBbm,
  "tanggalPembuatan" | "masaBerlakuRekomendasi"
> & {
  tanggalPembuatan: string;
  masaBerlakuRekomendasi: string;
};

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  updatedAt?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  data: SuratRekomendasiPembelianBbm[];
};

export const getAllSuratRekomendasiPembelianBbm = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/surat-rekomendasi-pembelian-bbm",
      {
        params: {
          page,
          limit,
          search,
          status,
          updatedAt,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const getSuratRekomendasiPembelianBbm = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const response =
      await axiosInstance.get<SuratRekomendasiPembelianBbmWithUser>(
        `/surat-rekomendasi-pembelian-bbm/${id}`
      );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const createSuratRekomendasiPembelianBbm = async ({
  body,
}: {
  body: Partial<SuratRekomendasiPembelianBbmForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SuratRekomendasiPembelianBbm>(
      `/surat-rekomendasi-pembelian-bbm`,
      body
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const updateSuratRekomendasiPembelianBbm = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SuratRekomendasiPembelianBbmForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SuratRekomendasiPembelianBbm>(
      `/surat-rekomendasi-pembelian-bbm/${id}`,
      body
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const deleteSuratRekomendasiPembelianBbm = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const response = await axiosInstance.delete<SuratRekomendasiPembelianBbm>(
      `/surat-rekomendasi-pembelian-bbm/${id}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const generateSuratRekomendasiPembelianBbm = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `/surat-rekomendasi-pembelian-bbm/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(
      blob,
      "surat_rekomendasi_pembelian_jenis_bbm_tertentu.pdf"
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
