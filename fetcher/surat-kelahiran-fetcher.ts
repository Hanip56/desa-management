import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import { SuratKelahiranType, SuratKelahiranDetailType } from "@/schemas";
import FileSaver from "file-saver";

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
  data: SuratKelahiranType[];
};

export const getAllSuratKelahiran = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/surat-kelahiran",
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

export const getSuratKelahiran = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SuratKelahiranDetailType>(
      `/surat-kelahiran/${id}`
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

export const createSuratKelahiran = async ({
  body,
}: {
  body: Partial<SuratKelahiranType>;
}) => {
  try {
    const response = await axiosInstance.post<SuratKelahiranType>(
      `/surat-kelahiran`,
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

export const updateSuratKelahiran = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SuratKelahiranType>;
}) => {
  try {
    const response = await axiosInstance.put<SuratKelahiranType>(
      `/surat-kelahiran/${id}`,
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

export const deleteSuratKelahiran = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SuratKelahiranType>(
      `/surat-kelahiran/${id}`
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

export const generateSuratKelahiran = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/surat-kelahiran/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_kelahiran.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
