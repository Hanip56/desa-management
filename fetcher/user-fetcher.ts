import axios from "axios";
import axiosInstance from "@/lib/axiosConfig";
import { User } from "@prisma/client";

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  updatedAt?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  data: User[];
};

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/users", {
      params: {
        page,
        limit,
        search,
        updatedAt,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

type UpdateParams = {
  username?: string;
  nomorWa?: string;
  password?: string;
  oldPassword?: string;
  userId: string;
};

export const updateUser = async ({
  username,
  nomorWa,
  password,
  oldPassword,
  userId,
}: UpdateParams) => {
  try {
    const response = await axiosInstance.put<User>(`/users/${userId}`, {
      username,
      nomorWa,
      password,
      oldPassword,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
