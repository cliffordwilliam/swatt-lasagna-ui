export function toQueryParams(obj: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;

    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    ) {
      throw new Error(
        `Invalid query param "${key}": expected a primitive value, received ${typeof value}`,
      );
    }

    params.set(key, String(value));
  }
  return params;
}
