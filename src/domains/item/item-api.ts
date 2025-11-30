import { apiPath, request } from "../common/utils/http";
import { toQueryParams } from "../common/utils/to-query-param";
import type {
  ItemFilter,
  ItemListResponse,
  ItemGetResponse,
  ItemCreateRequest,
  ItemCreateResponse,
  ItemUpdateRequest,
  ItemUpdateResponse,
} from "../item/types";

const BASE = apiPath("/item");

export async function listItems(filter: ItemFilter): Promise<ItemListResponse> {
  const params = toQueryParams(filter).toString();
  return request<ItemListResponse>(`${BASE}?${params}`);
}

export async function getItem(id: number): Promise<ItemGetResponse> {
  return request<ItemGetResponse>(`${BASE}/${id}`);
}

export async function createItem(
  body: ItemCreateRequest,
): Promise<ItemCreateResponse> {
  return request<ItemCreateResponse>(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function updateItem(
  id: number,
  body: ItemUpdateRequest,
): Promise<ItemUpdateResponse> {
  return request<ItemUpdateResponse>(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
