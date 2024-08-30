import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkDomisiliSementara } from "@prisma/client";
import { SkDomisiliSementaraWithUser } from "@/types";

type SkDomisiliSementaraForDB = Omit<
  SkDomisiliSementara,
  "tanggalLahir" | "tanggalPembuatan"
> & {
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
  data: SkDomisiliSementara[];
};

export const getAllSkDomisiliSementara = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-domisili-sementara",
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

export const getSkDomisiliSementara = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkDomisiliSementaraWithUser>(
      `/sk-domisili-sementara/${id}`
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

export const createSkDomisiliSementara = async ({
  body,
}: {
  body: Partial<SkDomisiliSementaraForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkDomisiliSementara>(
      `/sk-domisili-sementara`,
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

export const updateSkDomisiliSementara = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkDomisiliSementaraForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkDomisiliSementara>(
      `/sk-domisili-sementara/${id}`,
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

export const deleteSkDomisiliSementara = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkDomisiliSementara>(
      `/sk-domisili-sementara/${id}`
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

export const generateSkDomisiliSementara = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-domisili-sementara/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_domisili_sementara.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
