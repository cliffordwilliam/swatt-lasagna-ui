import { z } from "zod";

export const ItemCreateSchema = z.object({
  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name is too long"),
  price: z.coerce
    .number()
    .int("Price must be an integer")
    .min(1, "Price must be at least 1")
    .max(50_000_000, "Price is too big"),
});

export const ItemUpdateSchema = z.object({
  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name is too long")
    .optional(),
  price: z.coerce
    .number()
    .int("Price must be an integer")
    .min(1, "Price must be at least 1")
    .max(50_000_000, "Price is too big")
    .optional(),
});

export type ItemCreateFormData = z.infer<typeof ItemCreateSchema>;
export type ItemUpdateFormData = z.infer<typeof ItemUpdateSchema>;
