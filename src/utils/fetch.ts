//const API_URL = import.meta.env.VITE_BASE_URL;

import { ResponseError } from "./types";

async function http<T>(path: string, config: RequestInit): Promise<T> {
  try {
    const request = new Request(path, config);
    const response = await fetch(request);

    if (!response.ok) {
      const data: { message: string } = await response.json();
      throw new ResponseError(data.message, response.status);
    }

    return await response.json().catch((error) => {
      console.error(error);
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Failed to fetch data, please check your internet connection or the url"
      );
    }
    throw e;
  }
}

export async function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: "GET", ...config };
  return http<T>(path, init);
}

export async function post<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = { method: "POST", body: JSON.stringify(body), ...config };
  return http<U>(path, init);
}

export async function put<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = { method: "PUT", body: JSON.stringify(body), ...config };
  return http<U>(path, init);
}

export async function del<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: "DELETE", ...config };
  return http<T>(path, init);
}

export async function patch<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = { method: "PATCH", body: JSON.stringify(body), ...config };
  return http<U>(path, init);
}

export async function postForm<U>(
  path: string,
  body: FormData,
  config?: RequestInit
): Promise<U> {
  const init = {
    method: "POST",
    body: body,
    ...config,
  };
  return http<U>(path, init);
}
