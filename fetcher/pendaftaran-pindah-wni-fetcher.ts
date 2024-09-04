import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import {
  PendaftaranPindahWniWithAnggota,
  PendaftaranPindahWniWithUser,
} from "@/types";
import { AnggotaPindahWni } from "@prisma/client";

type PendaftaranPindahWniWithAnggotaForDB = Omit<
  PendaftaranPindahWniWithAnggota,
  "tanggalPembuatan" | "anggotaPindah"
> & {
  tanggalPembuatan: string;
  anggotaPindah: Partial<AnggotaPindahWni>[];
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
  data: PendaftaranPindahWniWithAnggota[];
};

export const getAllPendaftaranPindahWni = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/pendaftaran-pindah-wni",
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

export const getPendaftaranPindahWni = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<PendaftaranPindahWniWithUser>(
      `/pendaftaran-pindah-wni/${id}`
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

export const createPendaftaranPindahWni = async ({
  body,
}: {
  body: Partial<PendaftaranPindahWniWithAnggotaForDB>;
}) => {
  try {
    const response = await axiosInstance.post<PendaftaranPindahWniWithAnggota>(
      `/pendaftaran-pindah-wni`,
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

export const updatePendaftaranPindahWni = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<PendaftaranPindahWniWithAnggotaForDB>;
}) => {
  try {
    const response = await axiosInstance.put<PendaftaranPindahWniWithAnggota>(
      `/pendaftaran-pindah-wni/${id}`,
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

export const deletePendaftaranPindahWni = async ({ id }: { id: string }) => {
  try {
    const response =
      await axiosInstance.delete<PendaftaranPindahWniWithAnggota>(
        `/pendaftaran-pindah-wni/${id}`
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

export const generatePendaftaranPindahWni = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(
      `/pendaftaran-pindah-wni/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "Pendaftaran_pindah_wni.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
