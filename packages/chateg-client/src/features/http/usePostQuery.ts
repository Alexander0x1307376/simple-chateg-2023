import { useState } from "react";
import httpClientWithAuth from "./httpClient";

export const usePostQuery = <InputData, Response>(url: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<Response | undefined>(undefined);

  const query = async (values: InputData): Promise<Response> => {
    try {
      setIsLoading(true);
      setError("");
      setData(undefined);
      const response = await httpClientWithAuth.post(url, values);
      setData(response.data as Response);
      return response.data as Response;
    } catch (error) {
      setData(undefined);
      setError(
        (error as { response: { data: { err: string } } })?.response?.data
          ?.err || "Error!!!"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading: isLoading && data,
    error,
    query,
  };
};
