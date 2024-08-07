import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import { SuratKelahiranType, SuratKelahiranDetailType } from "@/schemas";
import FileSaver from "file-saver";

type GetAllParams = {
  page?: number;
  limit?: number;
  token: string;
  search?: string;
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
  limit = 1,
  token,
  search,
}: GetAllParams) => {
  try {
    const response = await axiosInstance(token).get<GetAllResponse>(
      "/surat-kelahiran",
      {
        params: {
          page,
          limit,
          search,
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

export const getSuratKelahiran = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await axiosInstance(token).get<SuratKelahiranDetailType>(
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
  token,
  body,
}: {
  token: string;
  body: Partial<SuratKelahiranType>;
}) => {
  try {
    const response = await axiosInstance(token).post<SuratKelahiranType>(
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
  token,
  id,
  body,
}: {
  token: string;
  id: string;
  body: Partial<SuratKelahiranType>;
}) => {
  try {
    const response = await axiosInstance(token).put<SuratKelahiranType>(
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

export const deleteSuratKelahiran = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const response = await axiosInstance(token).delete<SuratKelahiranType>(
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

export const generateSuratKelahiran = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const response = await axiosInstance(token).get(
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
