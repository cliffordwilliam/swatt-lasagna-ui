import { apiPath, request } from "../common/utils/http";
import { toQueryParams } from "../common/utils/to-query-param";
import type {
  OrderFilter,
  OrderListResponse,
  OrderGetResponse,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderUpdateRequest,
  OrderUpdateResponse,
} from "./types";

const BASE = apiPath("/order");

export async function listOrders(
  filter: OrderFilter,
): Promise<OrderListResponse> {
  const params = toQueryParams(filter).toString();
  return request<OrderListResponse>(`${BASE}?${params}`);
}

export async function getOrder(id: number): Promise<OrderGetResponse> {
  return request<OrderGetResponse>(`${BASE}/${id}`);
}

export async function createOrder(
  body: OrderCreateRequest,
): Promise<OrderCreateResponse> {
  return request<OrderCreateResponse>(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function updateOrder(
  id: number,
  body: OrderUpdateRequest,
): Promise<OrderUpdateResponse> {
  return request<OrderUpdateResponse>(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
