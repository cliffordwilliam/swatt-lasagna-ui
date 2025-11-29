import { apiPath } from "../common/utils/http";
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
  const res = await fetch(`${BASE}?${params}`);
  return res.json() as Promise<ItemListResponse>;
}

export async function getItem(id: number): Promise<ItemGetResponse> {
  const res = await fetch(`${BASE}/${id}`);
  return res.json() as Promise<ItemGetResponse>;
}

export async function createItem(
  body: ItemCreateRequest,
): Promise<ItemCreateResponse> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<ItemCreateResponse>;
}

export async function updateItem(
  id: number,
  body: ItemUpdateRequest,
): Promise<ItemUpdateResponse> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<ItemUpdateResponse>;
}
