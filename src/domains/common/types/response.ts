export type SuccessResponse<T, M = undefined> = M extends undefined
  ? { success: boolean; data: T }
  : { success: boolean; data: T; meta: M };

export type ErrorResponse = {
  success: boolean;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  public code?: string;
  public details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}
