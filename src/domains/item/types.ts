import type {
  PaginationMeta,
  PaginationQuery,
} from "../common/types/pagination";
import type { SuccessResponse } from "../common/types/response";

export type Item = {
  itemId: number;
  itemName: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type ItemSortField = "itemName" | "price";

export type ItemFilter = PaginationQuery<
  {
    itemName?: string;
    price?: number;
  },
  ItemSortField
>;

export type ItemCreateRequest = {
  itemName: string;
  price: number;
};

export type ItemUpdateRequest = {
  itemName?: string;
  price?: number;
};

export type ItemListResponse = SuccessResponse<Item[], PaginationMeta>;
export type ItemGetResponse = SuccessResponse<Item>;
export type ItemCreateResponse = SuccessResponse<Item>;
export type ItemUpdateResponse = SuccessResponse<Item>;
