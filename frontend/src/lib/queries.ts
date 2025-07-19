import { customFetch } from "./customFetch";

export const getBooks = (params?: any) => {
  return {
    queryKey: ["books", params?.search ?? "", params?.genre ?? "all"],
    queryFn: async () => {
      const { data } = await customFetch.get(`/books`, { params });
      return data;
    },
  };
};
