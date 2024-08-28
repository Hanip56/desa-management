import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkIzinBekerja } from "@prisma/client";
import { SkIzinBekerjaWithUser } from "@/types";

type SkIzinBekerjaForDB = Omit<
  SkIzinBekerja,
  "tanggalLahir" | "tanggalPembuatan" | "izinDariHari" | "izinSampaiHari"
> & {
  tanggalLahir: string;
  tanggalPembuatan: string;
  izinDariHari: string;
  izinSampaiHari: string;
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
  data: SkIzinBekerja[];
};

export const getAllSkIzinBekerja = async ({
  page = 1,
  limit = 1,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-izin-bekerja",
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

export const getSkIzinBekerja = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkIzinBekerjaWithUser>(
      `/sk-izin-bekerja/${id}`
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

export const createSkIzinBekerja = async ({
  body,
}: {
  body: Partial<SkIzinBekerjaForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkIzinBekerja>(
      `/sk-izin-bekerja`,
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

export const updateSkIzinBekerja = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkIzinBekerjaForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkIzinBekerja>(
      `/sk-izin-bekerja/${id}`,
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

export const deleteSkIzinBekerja = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkIzinBekerja>(
      `/sk-izin-bekerja/${id}`
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

export const generateSkIzinBekerja = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-izin-bekerja/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_izin_bekerja.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
