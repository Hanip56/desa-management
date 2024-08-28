import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkBelumMenikah } from "@prisma/client";
import { SkBelumMenikahWithUser } from "@/types";

type SkBelumMenikahForDB = Omit<
  SkBelumMenikah,
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
  data: SkBelumMenikah[];
};

export const getAllSkBelumMenikah = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-belum-menikah",
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

export const getSkBelumMenikah = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkBelumMenikahWithUser>(
      `/sk-belum-menikah/${id}`
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

export const createSkBelumMenikah = async ({
  body,
}: {
  body: Partial<SkBelumMenikahForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkBelumMenikah>(
      `/sk-belum-menikah`,
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

export const updateSkBelumMenikah = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkBelumMenikahForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkBelumMenikah>(
      `/sk-belum-menikah/${id}`,
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

export const deleteSkBelumMenikah = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkBelumMenikah>(
      `/sk-belum-menikah/${id}`
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

export const generateSkBelumMenikah = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-belum-menikah/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_belum_menikah.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
