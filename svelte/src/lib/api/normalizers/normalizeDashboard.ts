export type LosingProduct = { name: string; lossPerItem: number };
export type LowStockItem = { name: string; stock: number };
export type ProductProfit = { name: string; profit: number };

export type DashboardNormalized =
  | {
      // regular dashboard payload
      availableStock: number;
      totalPrice: number;
      stockCost: number;
      totalProfit: number;
      losingProducts: LosingProduct[];
      lowStock: LowStockItem[];
      lowStockMessage?: string;
      isEmpty: false;
      topProducts: ProductProfit[];
      worstProducts: ProductProfit[];
    }
  | {
      // "no products"
      isEmpty: true;
      emptyMessage: string;
    };

export function normalizeDashboardResponse(raw: any): DashboardNormalized {
  // no products
  if (raw && typeof raw === 'object' && 'No products' in raw) {
    return { isEmpty: true, emptyMessage: raw['No products'] ?? 'No Products yet' };
  }

  const pa = raw?.products_available ?? {};
  const pp = raw?.products_profit ?? {};
  const ls = raw?.low_stock ?? {};

  // products_available
  const availableStock = Number(pa.available_stock ?? 0);
  const totalPrice = Number(pa.total_price ?? 0);

  // products_profit
  const stockCost = Number(pp['stock cost'] ?? 0);
  const totalProfit = Number(pp.profit ?? 0);

  // losing products ( can be empty [])
  const losingProducts: LosingProduct[] = Array.isArray(pp.losing_products)
    ? pp.losing_products.map((p: any) => ({
        name: String(p.name ?? ''),
        lossPerItem: Number(p['loss on each product'] ?? 0),
      }))
    : [];

  // low_stock can be either:
  //  a) { detail: "Your stock is all good" }
  //  b) { "You need more stock of ": [{ name, "stock available": n }, ...] }
  let lowStockMessage: string | undefined;
  let lowStock: LowStockItem[] = [];

  if ('detail' in ls) {
    lowStockMessage = String(ls.detail);
    lowStock = [];
  } else if ('You need more stock of ' in ls && Array.isArray(ls['You need more stock of '])) {
    lowStock = ls['You need more stock of '].map((i: any) => ({
      name: String(i.name ?? ''),
      stock: Number(i['stock available'] ?? 0),
    }));
  }

  // top and worst normalization
  const topRaw = raw?.products_top ?? {};
  const worstRaw = raw?.products_worst ?? {};

  const topProducts: ProductProfit[] = Object.entries(topRaw).map(([name, val]: [string, any]) => ({
    name,
    profit: Number(val.profit ?? 0),
  }));

  const worstProducts: ProductProfit[] = Object.entries(worstRaw).map(
    ([name, val]: [string, any]) => ({
      name,
      profit: Number(val.profit ?? 0),
    })
  );

  return {
    isEmpty: false,
    availableStock,
    totalPrice,
    stockCost,
    totalProfit,
    losingProducts,
    lowStock,
    lowStockMessage,
    topProducts,
    worstProducts,
  };
}
