import axiosInstance from "@/lib/axiosConfig";
import { Setting } from "@prisma/client";
import axios from "axios";

type UpdateSettingParams = {
  namaKepalaDesa?: string;
  tte?: string;
  namaCamat?: string;
  noRegCamat?: string;
  namaBabinsa?: string;
  pangkatBabinsa: string;
  nrpBabinsa: string;
  jabatanBabinsa: string;
  namaBhabinkamtibmas?: string;
  pangkatBhabinkamtibmas: string;
  nrpBhabinkamtibmas: string;
  jabatanBhabinkamtibmas: string;
};

export const updateSetting = async ({
  namaKepalaDesa,
  tte,
  namaCamat,
  noRegCamat,
  namaBabinsa,
  jabatanBabinsa,
  jabatanBhabinkamtibmas,
  nrpBabinsa,
  nrpBhabinkamtibmas,
  pangkatBabinsa,
  pangkatBhabinkamtibmas,
  namaBhabinkamtibmas,
}: Partial<UpdateSettingParams>) => {
  try {
    const formData = new FormData();
    const fields = {
      namaKepalaDesa,
      tte,
      namaCamat,
      noRegCamat,
      namaBabinsa,
      jabatanBabinsa,
      jabatanBhabinkamtibmas,
      nrpBabinsa,
      nrpBhabinkamtibmas,
      pangkatBabinsa,
      pangkatBhabinkamtibmas,
      namaBhabinkamtibmas,
    };

    Object.keys(fields).forEach((key) => {
      const field = fields[key as keyof typeof fields];
      if (field) {
        formData.append(key, field);
      }
    });

    const response = await axiosInstance.put<Setting>(`/setting`, formData);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
