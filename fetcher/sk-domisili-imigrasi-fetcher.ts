import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkDomisiliImigrasi } from "@prisma/client";
import { SkDomisiliImigrasiWithUser } from "@/types";

type SkDomisiliImigrasiForDB = Omit<
  SkDomisiliImigrasi,
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
  data: SkDomisiliImigrasi[];
};

export const getAllSkDomisiliImigrasi = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-domisili-imigrasi",
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

export const getSkDomisiliImigrasi = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkDomisiliImigrasiWithUser>(
      `/sk-domisili-imigrasi/${id}`
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

export const createSkDomisiliImigrasi = async ({
  body,
}: {
  body: Partial<SkDomisiliImigrasiForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkDomisiliImigrasi>(
      `/sk-domisili-imigrasi`,
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

export const updateSkDomisiliImigrasi = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkDomisiliImigrasiForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkDomisiliImigrasi>(
      `/sk-domisili-imigrasi/${id}`,
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

export const deleteSkDomisiliImigrasi = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.delete<SkDomisiliImigrasi>(
      `/sk-domisili-imigrasi/${id}`
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

export const generateSkDomisiliImigrasi = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/sk-domisili-imigrasi/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_domisili_imigrasi.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
