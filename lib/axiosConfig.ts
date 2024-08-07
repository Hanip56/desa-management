import axios from "axios";

const axiosInstance = (token: string | undefined) => {
  const instance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
    },
  });

  return instance;
};

export default axiosInstance;
