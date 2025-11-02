import api from "../api";

export interface ProductBase {
  name: string;
  description?: string;
  available_stock: number;
  price: number;
  cost?: number;
  platform?: string;
  img_url?: string;
}

export interface ProductOut extends ProductBase {
  id: number;
  created_at: string;
  updated_at: string;
  inactive: boolean;
}

export const postAddProduct = async (
  data: ProductBase
): Promise<ProductOut> => {
  const res = await api.post<ProductOut>("/product/add-product", data);
  return res.data;
};

export interface ProductUpdate {
  name?: string;
  description?: string;
  available_stock?: number;
  price?: number;
  cost?: number;
  platform?: string;
  img_url?: string;
}

export const patchUpdateProduct = async (
  product_id: number,
  data: ProductUpdate
): Promise<ProductOut> => {
  const res = await api.patch<ProductOut>(
    `/product/update-product/${product_id}`,
    data
  );
  return res.data;
};

export const putInactiveProduct = async (
  product_id: number
): Promise<ProductOut> => {
  const res = await api.put<ProductOut>(
    `/product/inactive-product/${product_id}`
  );
  return res.data;
};

export const putDeleteProduct = async (
  product_id: number
): Promise<ProductOut> => {
  const res = await api.put<ProductOut>(
    `/product/delete-product/${product_id}`
  );
  return res.data;
};

export type Order = "asc" | "desc";

type RawProductOut = {
  id: number;
  name: string;
  description: string | null;
  available_stock: number;
  price: string;
  cost: number | null;
  platform: string | null;
  img_url: string | null;
  created_at: string;
  updated_at: string;
  inactive: boolean;
};

export async function getMyProducts(
  order: Order = "desc"
): Promise<ProductOut[]> {
  const res = await api.get<RawProductOut[]>("/product/my-products", {
    params: { order },
  });

  return res.data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    available_stock: p.available_stock,
    price: parseFloat(p.price ?? "0"),
    cost: p.cost ?? 0,
    platform: p.platform ?? undefined,
    img_url: p.img_url ?? undefined,
    created_at: p.created_at,
    updated_at: p.updated_at,
    inactive: p.inactive,
  }));
}

interface RawProductsDashboard {
  products_available?: {
    available_stock: number;
    total_price: number;
  };
  products_profit?: {
    "stock cost": number;
    profit: number;
    losing_products: Array<{
      name: string;
      "loss on each product": number;
    }>;
  };
  low_stock?: {
    "You need more stock of ": Array<{
      name: string;
      "stock available": number;
    }>;
  };
  products_top?: Record<string, { profit: number }>;
  products_worst?: Record<string, { profit: number }>;
}

export interface ProductsDashboard {
  summary: {
    availableStock: number;
    totalPrice: number;
    stockCost: number;
    totalProfit: number;
  };
  losingProducts: Array<{ name: string; lossPerUnit: number }>;
  lowStock: Array<{ name: string; stockAvailable: number }>;
  topProducts: Array<{ name: string; profit: number }>;
  worstProducts: Array<{ name: string; profit: number }>;
}

function normalizeDashboard(raw: RawProductsDashboard): ProductsDashboard {
  const available = raw.products_available ?? {
    available_stock: 0,
    total_price: 0,
  };
  const profitBlk = raw.products_profit ?? {
    ["stock cost"]: 0,
    profit: 0,
    losing_products: [],
  };
  const lowBlk = raw.low_stock ?? { ["You need more stock of "]: [] };

  const top = Object.entries(raw.products_top ?? {}).map(([name, v]) => ({
    name,
    profit: Number(v?.profit ?? 0),
  }));

  const worst = Object.entries(raw.products_worst ?? {}).map(([name, v]) => ({
    name,
    profit: Number(v?.profit ?? 0),
  }));

  return {
    summary: {
      availableStock: Number(available.available_stock ?? 0),
      totalPrice: Number(available.total_price ?? 0),
      stockCost: Number(profitBlk["stock cost"] ?? 0),
      totalProfit: Number(profitBlk.profit ?? 0),
    },
    losingProducts: (profitBlk.losing_products ?? []).map((p) => ({
      name: p.name,
      lossPerUnit: Number(p["loss on each product"] ?? 0),
    })),
    lowStock: (lowBlk["You need more stock of "] ?? []).map((p) => ({
      name: p.name,
      stockAvailable: Number(p["stock available"] ?? 0),
    })),
    topProducts: top,
    worstProducts: worst,
  };
}

export async function getProductsDashboard(
  lowStockThreshold: number
): Promise<ProductsDashboard> {
  const res = await api.get<RawProductsDashboard>("/product/dashboard", {
    params: { low_stock_threshold: lowStockThreshold },
  });
  return normalizeDashboard(res.data);
}
