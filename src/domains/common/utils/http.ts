export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export function apiPath(path: string) {
  return `${API_BASE}${path}`;
}
