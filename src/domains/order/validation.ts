import { z } from "zod";

// Enum schemas
export const PickupDeliverySchema = z.enum([
  "Pickup",
  "Delivery",
  "Gojek",
  "Citytran",
  "Paxel",
  "Daytrans",
  "Baraya",
  "Lintas",
  "Bineka",
  "Jne",
]);

export const PaymentSchema = z.enum([
  "Tunai",
  "Kartu Kredit",
  "Transfer Bank",
  "QRIS",
]);

export const OrderStatusSchema = z.enum([
  "Downpayment",
  "Belum bayar",
  "Lunas",
]);

// Person phone schema
export const PersonPhoneSchema = z.object({
  phoneId: z.coerce.number().int().positive().optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is too short")
    .max(20, "Phone number is too long"),
  preferred: z.boolean(),
});

// Person address schema
export const PersonAddressSchema = z.object({
  addressId: z.coerce.number().int().positive().optional(),
  address: z
    .string()
    .min(1, "Address is too short")
    .max(500, "Address is too long"),
  preferred: z.boolean(),
});

// Person upsert schema
export const PersonUpsertSchema = z.object({
  personId: z.coerce.number().int().positive().optional(),
  personName: z
    .string()
    .min(1, "Person name is required")
    .max(100, "Person name is too long"),
  phone: PersonPhoneSchema.optional(),
  address: PersonAddressSchema.optional(),
});

// Order item schema
export const OrderItemSchema = z.object({
  itemId: z.coerce
    .number()
    .int()
    .positive("Item ID is required and must be positive"),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(10000, "Quantity is too large"),
  itemName: z.string().max(255, "Item name is too long").optional(),
  itemPrice: z.coerce
    .number()
    .int()
    .positive("Item price must be positive")
    .optional(),
});

// Order create schema
export const OrderCreateSchema = z.object({
  po: z
    .string()
    .min(1, "PO number is required")
    .max(255, "PO number is too long"),
  buyer: PersonUpsertSchema,
  recipient: PersonUpsertSchema,
  orderDate: z.string().min(1, "Order date is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  pickupDelivery: PickupDeliverySchema,
  shippingCost: z.coerce
    .number()
    .int()
    .min(0, "Shipping cost cannot be negative")
    .max(50_000_000, "Shipping cost is too large"),
  payment: PaymentSchema,
  orderStatus: OrderStatusSchema,
  note: z.string().max(5000, "Note is too long").optional(),
  items: z
    .array(OrderItemSchema)
    .min(1, "At least one item is required")
    .max(1000, "Too many items"),
});

// Order update schema (all fields optional)
export const OrderUpdateSchema = z.object({
  po: z
    .string()
    .min(1, "PO number is required")
    .max(255, "PO number is too long")
    .optional(),
  buyer: PersonUpsertSchema.optional(),
  recipient: PersonUpsertSchema.optional(),
  orderDate: z.string().min(1, "Order date is required").optional(),
  deliveryDate: z.string().min(1, "Delivery date is required").optional(),
  pickupDelivery: PickupDeliverySchema.optional(),
  shippingCost: z.coerce
    .number()
    .int()
    .min(0, "Shipping cost cannot be negative")
    .max(50_000_000, "Shipping cost is too large")
    .optional(),
  payment: PaymentSchema.optional(),
  orderStatus: OrderStatusSchema.optional(),
  note: z.string().max(5000, "Note is too long").optional(),
  items: z
    .array(OrderItemSchema)
    .min(1, "At least one item is required")
    .max(1000, "Too many items")
    .optional(),
});

// Export form data types
export type OrderCreateFormData = z.infer<typeof OrderCreateSchema>;
export type OrderUpdateFormData = z.infer<typeof OrderUpdateSchema>;
export type PersonUpsertFormData = z.infer<typeof PersonUpsertSchema>;
export type OrderItemFormData = z.infer<typeof OrderItemSchema>;
