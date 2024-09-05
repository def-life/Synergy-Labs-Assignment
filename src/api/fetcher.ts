const BASE_URL = "https://api.example.com";

export const fetcher = async<T>(url: string, options?: RequestInit): Promise<T> => 
  fetch(`${BASE_URL}${url}`, options).then(res => res.json());