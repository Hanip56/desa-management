import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkUsaha } from "@prisma/client";
import { SkUsahaWithUser } from "@/types";

type SkUsahaForDB = Omit<SkUsaha, "tanggalLahir" | "tanggalPembuatan"> & {
  tanggalLahir: string;
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
  data: SkUsaha[];
};

export const getAllSkUsaha = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/sk-usaha", {
      params: {
        page,
        limit,
        search,
        status,
        updatedAt,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const getSkUsaha = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkUsahaWithUser>(
      `/sk-usaha/${id}`
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

export const createSkUsaha = async ({
  body,
}: {
  body: Partial<SkUsahaForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkUsaha>(`/sk-usaha`, body);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const updateSkUsaha = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkUsahaForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkUsaha>(`/sk-usaha/${id}`, body);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const deleteSkUsaha = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkUsaha>(`/sk-usaha/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const generateSkUsaha = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(`/sk-usaha/${id}/generate`, {
      responseType: "blob",
    });

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_usaha.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
