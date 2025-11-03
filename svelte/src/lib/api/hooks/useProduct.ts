import {
  getMyProducts,
  postAddProduct,
  patchUpdateProduct,
  putInactiveProduct,
  putDeleteProduct,
  type ProductOut,
  type ProductBase,
  type ProductUpdate,
  type Order,
} from '$lib/api/endpoints/product';

import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

// Keys
export const productKeys = {
  all: ['products'] as const,
  list: (order: Order) => [...productKeys.all, 'list', order] as const,
  byId: (id: number) => [...productKeys.all, 'by-id', id] as const,
};

// Queries
export function useMyProducts(order: Order, enabled = true) {
  return createQuery<ProductOut[], Error>(() => ({
    queryKey: productKeys.list(order),
    queryFn: () => getMyProducts(order),
    enabled,
    staleTime: 60_000,
  }));
}

// Mutations
export function usePostAddProduct() {
  const qc = useQueryClient();
  return createMutation<ProductOut, Error, ProductBase>(() => ({
    mutationFn: postAddProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  }));
}

export function usePatchUpdateProduct(productId: number) {
  const qc = useQueryClient();
  return createMutation<ProductOut, Error, ProductUpdate>(() => ({
    mutationFn: (data) => patchUpdateProduct(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  }));
}

export function useInactiveProduct() {
  const qc = useQueryClient();
  return createMutation<ProductOut, Error, number>(() => ({
    mutationFn: (id) => putInactiveProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  }));
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return createMutation<{ detail?: string }, Error, number>(() => ({
    mutationFn: (id) => putDeleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  }));
}
