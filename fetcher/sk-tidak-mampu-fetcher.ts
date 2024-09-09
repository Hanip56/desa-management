import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkTidakMampu } from "@prisma/client";
import { SkTidakMampuWithUser } from "@/types";

type SkTidakMampuForDB = Omit<
  SkTidakMampu,
  "tanggalLahir" | "tanggalPembuatan" | "tanggalLahirOrangTua"
> & {
  tanggalLahir: string;
  tanggalLahirOrangTua: string;
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
  data: SkTidakMampu[];
};

export const getAllSkTidakMampu = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-tidak-mampu",
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

export const getSkTidakMampu = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkTidakMampuWithUser>(
      `/sk-tidak-mampu/${id}`
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

export const createSkTidakMampu = async ({
  body,
}: {
  body: Partial<SkTidakMampuForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkTidakMampu>(
      `/sk-tidak-mampu`,
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

export const updateSkTidakMampu = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkTidakMampuForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkTidakMampu>(
      `/sk-tidak-mampu/${id}`,
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

export const deleteSkTidakMampu = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkTidakMampu>(
      `/sk-tidak-mampu/${id}`
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

export const generateSkTidakMampu = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(`/sk-tidak-mampu/${id}/generate`, {
      responseType: "blob",
    });

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_tidak_mampu.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
