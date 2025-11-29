export type SuccessResponse<T, M = undefined> = M extends undefined
  ? { success: boolean; data: T }
  : { success: boolean; data: T; meta: M };
