import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SuratKematian } from "@prisma/client";
import { SuratKematianWithUser } from "@/types";

type SuratKematianForDB = Omit<
  SuratKematian,
  "tanggal" | "tanggalPembuatan"
> & {
  tanggal: string;
  tanggalPembuatan: string;
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
  data: SuratKematian[];
};

export const getAllSuratKematian = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/surat-kematian",
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

export const getSuratKematian = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SuratKematianWithUser>(
      `/surat-kematian/${id}`
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

export const createSuratKematian = async ({
  body,
}: {
  body: Partial<SuratKematianForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SuratKematian>(
      `/surat-kematian`,
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

export const updateSuratKematian = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SuratKematianForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SuratKematian>(
      `/surat-kematian/${id}`,
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

export const deleteSuratKematian = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SuratKematian>(
      `/surat-kematian/${id}`
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

export const generateSuratKematian = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(`/surat-kematian/${id}/generate`, {
      responseType: "blob",
    });

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_kematian.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
