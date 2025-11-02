import { useMutation, useQuery } from "@tanstack/react-query";
import {
  postAddProduct,
  patchUpdateProduct,
  putDeleteProduct,
  putInactiveProduct,
  getMyProducts,
  getProductsDashboard,
} from "../endpoints/product";

import type {
  ProductBase,
  ProductOut,
  ProductUpdate,
  Order,
  ProductsDashboard,
} from "../endpoints/product";

export function usePostAddProduct() {
  return useMutation<ProductOut, unknown, ProductBase>({
    mutationFn: postAddProduct,
  });
}

export function usePatchUpdateProduct(product_id: number) {
  return useMutation<ProductOut, unknown, ProductUpdate>({
    mutationFn: (data) => patchUpdateProduct(product_id, data),
  });
}

export function useInactiveProduct() {
  return useMutation<ProductOut, unknown, number>({
    mutationFn: putInactiveProduct,
  });
}

export function useDeleteProduct() {
  return useMutation<ProductOut, unknown, number>({
    mutationFn: putDeleteProduct,
  });
}

export function useMyProducts(order: Order = "desc") {
  return useQuery({
    queryKey: ["my-products", order],
    queryFn: () => getMyProducts(order),
  });
}

export function useDashboard(lowStockThreshold: number) {
  return useQuery<ProductsDashboard>({
    queryKey: ["dashboard", lowStockThreshold],
    queryFn: () => getProductsDashboard(lowStockThreshold),
    staleTime: 60_000, // opcional: 1 min “fresh”
    enabled: Number.isFinite(lowStockThreshold),
  });
}
