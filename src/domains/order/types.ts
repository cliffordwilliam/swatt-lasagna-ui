import type {
  PaginationMeta,
  PaginationQuery,
} from "../common/types/pagination";
import type { SuccessResponse } from "../common/types/response";

// Enums matching backend
export type PickupDelivery =
  | "Pickup"
  | "Delivery"
  | "Gojek"
  | "Citytran"
  | "Paxel"
  | "Daytrans"
  | "Baraya"
  | "Lintas"
  | "Bineka"
  | "Jne";

export type Payment = "Tunai" | "Kartu Kredit" | "Transfer Bank" | "QRIS";

export type OrderStatus = "Downpayment" | "Belum bayar" | "Lunas";

// Order item response
export type OrderItem = {
  itemId: number;
  quantity: number;
  itemName: string;
  itemPrice: number;
};

// Complete order response
export type Order = {
  orderId: number;
  po: string;
  buyerId: number;
  recipientId: number;
  orderDate: string;
  deliveryDate: string;
  totalPurchase: number;
  pickupDelivery: PickupDelivery;
  shippingCost: number;
  grandTotal: number;
  payment: Payment;
  orderStatus: OrderStatus;
  note?: string | null;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

// Person upsert for buyer/recipient
export type PersonPhone = {
  phoneId?: number;
  phoneNumber: string;
  preferred: boolean;
};

export type PersonAddress = {
  addressId?: number;
  address: string;
  preferred: boolean;
};

export type PersonUpsert = {
  personId?: number;
  personName: string;
  phone?: PersonPhone;
  address?: PersonAddress;
};

// Order item request
export type OrderItemRequest = {
  itemId: number;
  quantity: number;
  itemName?: string;
  itemPrice?: number;
};

// Order create request
export type OrderCreateRequest = {
  po: string;
  buyer: PersonUpsert;
  recipient: PersonUpsert;
  orderDate: string;
  deliveryDate: string;
  pickupDelivery: PickupDelivery;
  shippingCost: number;
  payment: Payment;
  orderStatus: OrderStatus;
  note?: string;
  items: OrderItemRequest[];
};

// Order update request (all fields optional)
export type OrderUpdateRequest = {
  po?: string;
  buyer?: PersonUpsert;
  recipient?: PersonUpsert;
  orderDate?: string;
  deliveryDate?: string;
  pickupDelivery?: PickupDelivery;
  shippingCost?: number;
  payment?: Payment;
  orderStatus?: OrderStatus;
  note?: string;
  items?: OrderItemRequest[];
};

// Sort field for orders
export type OrderSortField =
  | "po"
  | "orderDate"
  | "deliveryDate"
  | "totalPurchase"
  | "grandTotal";

// Order filter for list queries
export type OrderFilter = PaginationQuery<
  {
    po?: string;
    buyerId?: number;
    recipientId?: number;
    orderStatus?: OrderStatus;
    payment?: Payment;
  },
  OrderSortField
>;

// Response types
export type OrderListResponse = SuccessResponse<Order[], PaginationMeta>;
export type OrderGetResponse = SuccessResponse<Order>;
export type OrderCreateResponse = SuccessResponse<Order>;
export type OrderUpdateResponse = SuccessResponse<Order>;
