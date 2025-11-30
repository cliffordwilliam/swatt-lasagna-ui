import { ApiError, type ErrorResponse } from "../types/response";

export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export function apiPath(path: string) {
  return `${API_BASE}${path}`;
}

export async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);
  if (res.ok) {
    return (await res.json()) as T;
  }
  const errorResponse = (await res.json()) as ErrorResponse;
  throw new ApiError(
    errorResponse.error.message,
    errorResponse.error.code,
    errorResponse.error.details,
  );
}
