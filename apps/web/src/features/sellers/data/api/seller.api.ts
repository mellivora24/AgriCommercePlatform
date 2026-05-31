import type { AxiosInstance } from "axios";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSellerApi = (axiosInstance: AxiosInstance) => ({
  placeHolderFunction: () => {
    console.log("This is a placeholder function for the Seller API.");
  }
});

export type SellerApi = ReturnType<typeof createSellerApi>;