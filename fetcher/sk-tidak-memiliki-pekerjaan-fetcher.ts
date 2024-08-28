import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import FileSaver from "file-saver";
import { SkTidakMemilikiPekerjaan } from "@prisma/client";
import { SkTidakMemilikiPekerjaanWithUser } from "@/types";

type SkTidakMemilikiPekerjaanForDB = Omit<
  SkTidakMemilikiPekerjaan,
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
  data: SkTidakMemilikiPekerjaan[];
};

export const getAllSkTidakMemilikiPekerjaan = async ({
  page = 1,
  limit = 10,
  search,
  status,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/sk-tidak-memiliki-pekerjaan",
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

export const getSkTidakMemilikiPekerjaan = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get<SkTidakMemilikiPekerjaanWithUser>(
      `/sk-tidak-memiliki-pekerjaan/${id}`
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

export const createSkTidakMemilikiPekerjaan = async ({
  body,
}: {
  body: Partial<SkTidakMemilikiPekerjaanForDB>;
}) => {
  try {
    const response = await axiosInstance.post<SkTidakMemilikiPekerjaan>(
      `/sk-tidak-memiliki-pekerjaan`,
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

export const updateSkTidakMemilikiPekerjaan = async ({
  id,
  body,
}: {
  id: string;
  body: Partial<SkTidakMemilikiPekerjaanForDB>;
}) => {
  try {
    const response = await axiosInstance.put<SkTidakMemilikiPekerjaan>(
      `/sk-tidak-memiliki-pekerjaan/${id}`,
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

export const deleteSkTidakMemilikiPekerjaan = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const response = await axiosInstance.delete<SkTidakMemilikiPekerjaan>(
      `/sk-tidak-memiliki-pekerjaan/${id}`
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

export const generateSkTidakMemilikiPekerjaan = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `/sk-tidak-memiliki-pekerjaan/${id}/generate`,
      {
        responseType: "blob",
      }
    );

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Use FileSaver.js to save the Blob as a file
    FileSaver.saveAs(blob, "surat_keterangan_tidak_memiliki_pekerjaan.pdf");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
