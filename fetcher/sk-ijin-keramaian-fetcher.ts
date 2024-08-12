import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkIjinKeramaian } from "@prisma/client";
import { SkIjinKeramaianWithUser } from "@/types";

type SkIjinKeramaianForDB = Omit<
  SkIjinKeramaian,
  "tanggalLahir" | "tanggalPembuatan"
> & {
  tanggalLahir: string;
  tanggalPembuatan: string;
};

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  data: SkIjinKeramaian[];
};

export const getAllSkIjinKeramaian = async ({
  page = 1,
  limit = 1,
  search,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-ijin-keramaian",
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

export const getSkIjinKeramaian = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkIjinKeramaianWithUser>(
      `/sk-ijin-keramaian/${id}`
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

export const createSkIjinKeramaian = async ({
  body,
}: {
  body: Partial<SkIjinKeramaianForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkIjinKeramaian>(
      `/sk-ijin-keramaian`,
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

export const updateSkIjinKeramaian = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkIjinKeramaianForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkIjinKeramaian>(
      `/sk-ijin-keramaian/${id}`,
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

export const deleteSkIjinKeramaian = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkIjinKeramaian>(
      `/sk-ijin-keramaian/${id}`
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

export const generateSkIjinKeramaian = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-ijin-keramaian/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_ijin_keramaian.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
