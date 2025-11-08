import { useEffect, useMemo, useState } from "react";
import { useDashboard } from "@/app/hooks/useProduct";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// icons
import {
  AlertTriangle,
  DollarSign,
  Package,
  TrendingDown,
  TrendingUp,
  Save,
  RefreshCcw,
} from "lucide-react";


type ApiProductsDashboard = {
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
};


type LosingProduct = { name: string; lossPerItem: number };
type ProfitRow = { name: string; profit: number };
type LowStockRow = { name: string; stock: number };

type DashboardData = {
  summary: {
    availableStock: number;
    totalPrice: number; 
    stockCost: number; 
    totalProfit: number; 
    capacityTarget?: number; 
  };
  losingProducts: LosingProduct[];
  topLucrative: ProfitRow[];
  worstLucrative: ProfitRow[];
  lowStock: LowStockRow[];
};

function mapToDashboardData(api: ApiProductsDashboard): DashboardData {
  return {
    summary: {
      availableStock: api.summary.availableStock,
      totalPrice: api.summary.totalPrice,
      stockCost: api.summary.stockCost,
      totalProfit: api.summary.totalProfit,
      capacityTarget: undefined,
    },
    losingProducts: (api.losingProducts ?? []).map((p) => ({
      name: p.name,
      lossPerItem: p.lossPerUnit,
    })),
    lowStock: (api.lowStock ?? []).map((p) => ({
      name: p.name,
      stock: p.stockAvailable,
    })),
    topLucrative: api.topProducts ?? [],
    worstLucrative: api.worstProducts ?? [],
  };
}


const CURRENCY = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export default function UserDashboardPage() {
  // threshold (persistimos no localStorage)
  const [threshold, setThreshold] = useState<number>(() => {
    const saved = localStorage.getItem("kira:lowStockThreshold");
    return saved ? Number(saved) : 3;
  });

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useDashboard(threshold);

  useEffect(() => {
    localStorage.setItem("kira:lowStockThreshold", String(threshold));
  }, [threshold]);

  const dash: DashboardData | undefined = useMemo(
    () =>
      apiData ? mapToDashboardData(apiData as ApiProductsDashboard) : undefined,
    [apiData]
  );

  const capacityTarget = useMemo(() => {
    const fromApi = dash?.summary.capacityTarget;
    if (typeof fromApi === "number" && fromApi > 0) return fromApi;
    const saved = localStorage.getItem("kira:stockCapacity");
    return saved ? Number(saved) : 200;
  }, [dash]);

  const available = dash?.summary.availableStock;
  const capacityUsed =
    typeof available === "number" && capacityTarget > 0
      ? Math.min(Math.round((available / capacityTarget) * 100), 100)
      : 0;

  /* =================== STATES =================== */
  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 py-10">
        <Card className="bg-neutral-900/50 border border-neutral-800/80">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-sm">
              Loading dashboard…
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-6 w-40 rounded bg-neutral-800 animate-pulse" />
            <div className="h-40 w-full rounded bg-neutral-800/60 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !dash) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 py-10 text-neutral-300">
        <Card className="bg-neutral-900/60 border border-neutral-800/80">
          <CardHeader>
            <CardTitle className="text-sm text-red-400">
              Erro ao carregar dashboard
            </CardTitle>
            <CardDescription className="text-[12px] text-neutral-500">
              Tenta novamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => refetch()}
              className="bg-neutral-200 text-neutral-900 hover:bg-white"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =================== UI =================== */
  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 pb-10 text-neutral-100 flex flex-col gap-6">
      {/* ROW 1 */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Inventory overview */}
        <Card className="bg-neutral-900/50 border border-neutral-800/80 text-neutral-100 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Package className="h-4 w-4 text-neutral-400" />
                  Inventory overview
                </CardTitle>
                <CardDescription className="text-[12px] text-neutral-500">
                  Snapshot of your current stock value.
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className="border-neutral-700 bg-neutral-800/60 text-[10px] uppercase tracking-wide text-neutral-300"
              >
                Live
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-neutral-300">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] text-neutral-500">
                  Total items in stock
                </p>
                <p className="text-lg font-semibold text-neutral-100">
                  {dash.summary.availableStock}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[11px] text-neutral-500">
                  Total stock value
                </p>
                <p className="text-lg font-semibold text-neutral-100">
                  {CURRENCY.format(dash.summary.totalPrice ?? 0)}
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] text-neutral-400">
                <span>Capacity used</span>
                <span className="text-neutral-200 font-medium">
                  {capacityUsed}%
                </span>
              </div>
              <Progress
                value={capacityUsed}
                className="h-2 bg-neutral-800 [&>div]:bg-neutral-200"
              />
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Based on a target of{" "}
                <span className="text-neutral-300 font-medium">
                  {capacityTarget}
                </span>{" "}
                total items (from settings).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profit summary */}
        <Card className="bg-neutral-900/50 border border-neutral-800/80 text-neutral-100 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-neutral-400" />
                  Profit summary
                </CardTitle>
                <CardDescription className="text-[12px] text-neutral-500">
                  Overall margin based on cost / sale price.
                </CardDescription>
              </div>

              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-600/30 text-[10px] font-medium">
                + healthy
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-neutral-300 space-y-4">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] text-neutral-500">Stock cost</p>
                <p className="text-lg font-semibold text-neutral-100">
                  {CURRENCY.format(dash.summary.stockCost ?? 0)}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[11px] text-neutral-500">
                  Total / potential profit
                </p>
                <p className="text-lg font-semibold text-neutral-100">
                  {CURRENCY.format(dash.summary.totalProfit ?? 0)}
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="space-y-2">
              <p className="text-[12px] font-medium text-neutral-300 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-400" />
                Losing products
              </p>

              {dash.losingProducts?.length ? (
                <ul className="space-y-1 text-[12px] text-neutral-400">
                  {dash.losingProducts.map((p, i) => (
                    <li
                      key={`${p.name}-${i}`}
                      className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-1"
                    >
                      <span className="text-neutral-300">{p.name}</span>
                      <span className="text-red-400 font-medium">
                        -{CURRENCY.format(p.lossPerItem ?? 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-neutral-500">
                  None of your items are losing money 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low stock alerts */}
        <Card className="bg-neutral-900/50 border border-neutral-800/80 text-neutral-100 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  Low stock alerts
                </CardTitle>
                <CardDescription className="text-[12px] text-neutral-500">
                  Items that need restocking soon.
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className="border-yellow-500/30 bg-yellow-500/10 text-[10px] text-yellow-400 uppercase tracking-wide"
              >
                {dash.lowStock?.length ?? 0} items
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-neutral-300 space-y-3">
            {/* threshold control */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="h-8 w-24 bg-neutral-800/60 border-neutral-700 text-neutral-100"
              />
              <Button
                onClick={() => refetch()}
                className="h-8 px-3 bg-neutral-200 text-neutral-900 hover:bg-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button
                onClick={() => refetch()}
                variant="ghost"
                className="h-8 px-3 text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {dash.lowStock?.length ? (
              <ScrollArea className="max-h-44 pr-2">
                <ul className="space-y-2 text-[12px]">
                  {dash.lowStock.map((item, i) => (
                    <li
                      key={`${item.name}-${i}`}
                      className="flex flex-col rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-2"
                    >
                      <span className="text-neutral-100 font-medium">
                        {item.name}
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        Stock available:{" "}
                        <span
                          className={
                            item.stock === 0
                              ? "text-red-400 font-medium"
                              : "text-yellow-400 font-medium"
                          }
                        >
                          {item.stock}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-[11px] text-neutral-500">
                All good. You&apos;re fully stocked 🟢
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ROW 2 */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <Card className="bg-neutral-900/50 border border-neutral-800/80 text-neutral-100 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Top products (profit)
                </CardTitle>
                <CardDescription className="text-[12px] text-neutral-500">
                  Best performing items by margin.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-600/30 text-[10px] font-medium">
                Good sellers
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-neutral-300">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/70">
                  <TableHead className="text-[12px] text-neutral-500 font-medium">
                    Product
                  </TableHead>
                  <TableHead className="text-right text-[12px] text-neutral-500 font-medium">
                    Profit
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dash.topLucrative ?? []).map((p, i) => (
                  <TableRow
                    key={`${p.name}-${i}`}
                    className="border-neutral-800/70 hover:bg-neutral-900/40"
                  >
                    <TableCell className="font-medium text-neutral-200">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-400">
                      {CURRENCY.format(p.profit ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
                {!dash.topLucrative?.length && (
                  <TableRow className="border-neutral-800/70 hover:bg-transparent">
                    <TableCell
                      colSpan={2}
                      className="py-6 text-center text-[12px] text-neutral-500"
                    >
                      No data yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Worst products */}
        <Card className="bg-neutral-900/50 border border-neutral-800/80 text-neutral-100 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  Worst products (loss)
                </CardTitle>
                <CardDescription className="text-[12px] text-neutral-500">
                  Items hurting your margin.
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className="border-red-600/30 bg-red-600/10 text-[10px] text-red-400 font-medium"
              >
                Review
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-neutral-300">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/70">
                  <TableHead className="text-[12px] text-neutral-500 font-medium">
                    Product
                  </TableHead>
                  <TableHead className="text-right text-[12px] text-neutral-500 font-medium">
                    Profit / Loss
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dash.worstLucrative ?? []).map((p, i) => (
                  <TableRow
                    key={`${p.name}-${i}`}
                    className="border-neutral-800/70 hover:bg-neutral-900/40"
                  >
                    <TableCell className="font-medium text-neutral-200">
                      {p.name}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        (p.profit ?? 0) < 0
                          ? "text-red-400"
                          : "text-neutral-300"
                      }`}
                    >
                      {CURRENCY.format(p.profit ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
                {!dash.worstLucrative?.length && (
                  <TableRow className="border-neutral-800/70 hover:bg-transparent">
                    <TableCell
                      colSpan={2}
                      className="py-6 text-center text-[12px] text-neutral-500"
                    >
                      No data yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
