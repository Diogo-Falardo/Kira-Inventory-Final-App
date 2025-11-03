import { z } from 'zod';
import { apiFetch, formatZodError } from '../api';

// ── Schemas (request)
export const ProductBaseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional(),
  available_stock: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative().optional(),
  platform: z.string().optional(),
  img_url: z.string().url('Invalid URL').optional(),
});
export type ProductBase = z.infer<typeof ProductBaseSchema>;

export const ProductUpdateSchema = ProductBaseSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'At least one field is required' }
);
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

export const OrderSchema = z.enum(['asc', 'desc']);
export type Order = z.infer<typeof OrderSchema>;

// ── Schemas (response)
export const ProductOutSchema = ProductBaseSchema.extend({
  id: z.number().int().positive(),
  created_at: z.string(),
  updated_at: z.string(),
  inactive: z.boolean(),
});
export type ProductOut = z.infer<typeof ProductOutSchema>;

// API returns price as string; nullable fields
const RawProductOutSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  available_stock: z.coerce.number(),
  price: z.coerce.number(), // Decimal → number
  cost: z.coerce.number().nullable().optional(), // Optional[Decimal] → number|null
  platform: z.string().nullable().optional(),
  img_url: z.string().nullable().optional(), // Optional[str] → string|null
  created_at: z.string(), // ISO
  updated_at: z.string(), // ISO
  inactive: z.coerce.boolean(),
});
type RawProductOut = z.infer<typeof RawProductOutSchema>;

// ── Calls
export async function postAddProduct(data: ProductBase): Promise<ProductOut> {
  const parsed = ProductBaseSchema.safeParse(data);
  if (!parsed.success) throw new Error(formatZodError(parsed.error));

  return apiFetch<ProductOut>('/product/add-product', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });
}

export async function patchUpdateProduct(
  product_id: number,
  data: ProductUpdate
): Promise<ProductOut> {
  const parsed = ProductUpdateSchema.safeParse(data);
  if (!parsed.success) throw new Error(formatZodError(parsed.error));

  return apiFetch<ProductOut>(`/product/update-product/${product_id}`, {
    method: 'PATCH',
    body: JSON.stringify(parsed.data),
  });
}

export async function putInactiveProduct(product_id: number): Promise<ProductOut> {
  return apiFetch<ProductOut>(`/product/inactive-product/${product_id}`, {
    method: 'PUT',
  });
}

export async function putDeleteProduct(product_id: number): Promise<{ detail?: string }> {
  return apiFetch(`/product/delete-product/${product_id}`, {
    method: 'DELETE',
  });
}

export async function getMyProducts(order: 'asc' | 'desc' = 'desc') {
  const res = await apiFetch<unknown>(`/product/my-products?order=${order}`);

  const parsed = z.array(RawProductOutSchema).safeParse(res);
  if (!parsed.success) throw new Error('Invalid products payload');

  return parsed.data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    available_stock: p.available_stock,
    price: p.price, // already number
    cost: p.cost ?? 0, // normalize null → 0 to simplify UI math
    platform: p.platform ?? undefined,
    img_url: p.img_url ?? undefined,
    created_at: p.created_at,
    updated_at: p.updated_at,
    inactive: p.inactive,
  }));
}
