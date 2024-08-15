import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkPenghasilanOrangTua } from "@prisma/client";
import { SkPenghasilanOrangTuaWithUser } from "@/types";

type SkPenghasilanOrangTuaForDB = Omit<
  SkPenghasilanOrangTua,
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
  data: SkPenghasilanOrangTua[];
};

export const getAllSkPenghasilanOrangTua = async ({
  page = 1,
  limit = 1,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-penghasilan-orang-tua",
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

export const getSkPenghasilanOrangTua = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkPenghasilanOrangTuaWithUser>(
      `/sk-penghasilan-orang-tua/${id}`
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

export const createSkPenghasilanOrangTua = async ({
  body,
}: {
  body: Partial<SkPenghasilanOrangTuaForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkPenghasilanOrangTua>(
      `/sk-penghasilan-orang-tua`,
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

export const updateSkPenghasilanOrangTua = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkPenghasilanOrangTuaForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkPenghasilanOrangTua>(
      `/sk-penghasilan-orang-tua/${id}`,
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

export const deleteSkPenghasilanOrangTua = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkPenghasilanOrangTua>(
      `/sk-penghasilan-orang-tua/${id}`
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

export const generateSkPenghasilanOrangTua = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-penghasilan-orang-tua/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_penghasilan_orang_tua.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
