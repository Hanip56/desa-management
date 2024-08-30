import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkDomisiliLembaga } from "@prisma/client";
import { SkDomisiliLembagaWithUser } from "@/types";

type SkDomisiliLembagaForDB = Omit<
  SkDomisiliLembaga,
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
  data: SkDomisiliLembaga[];
};

export const getAllSkDomisiliLembaga = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-domisili-lembaga",
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

export const getSkDomisiliLembaga = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkDomisiliLembagaWithUser>(
      `/sk-domisili-lembaga/${id}`
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

export const createSkDomisiliLembaga = async ({
  body,
}: {
  body: Partial<SkDomisiliLembagaForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkDomisiliLembaga>(
      `/sk-domisili-lembaga`,
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

export const updateSkDomisiliLembaga = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkDomisiliLembagaForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkDomisiliLembaga>(
      `/sk-domisili-lembaga/${id}`,
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

export const deleteSkDomisiliLembaga = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkDomisiliLembaga>(
      `/sk-domisili-lembaga/${id}`
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

export const generateSkDomisiliLembaga = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-domisili-lembaga/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_domisili_lembaga.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
