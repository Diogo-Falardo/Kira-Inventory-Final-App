import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
} from "lucide-react";

export default function UserDashboardPage() {
  // MOCK DATA
  const stockOverview = {
    available_stock: 150,
    total_price: "6592.00 €",
  };

  const profitSummary = {
    stock_cost: "2087.00 €",
    profit: "6592.00 €",
    losing_products: [
      { name: "product1", loss_per_item: "10.00 €" },
      { name: "Teste123Product", loss_per_item: "36.00 €" },
    ],
  };

  const topLucrative = [
    { name: "product4", profit: "85.00 €" },
    { name: "product3", profit: "30.00 €" },
    { name: "product2", profit: "20.00 €" },
  ];

  const worstLucrative = [
    { name: "Teste123Product", profit: "-36.00 €" },
    { name: "product1", profit: "-10.00 €" },
    { name: "dd", profit: "0.00 €" },
  ];

  const lowStock = [
    { name: "dd", stock: 2 },
    { name: "TESTE", stock: 0 },
    { name: "Teste123Product", stock: 0 },
  ];

  const stockFillPercent = Math.min(
    Math.round((stockOverview.available_stock / 200) * 100),
    100
  );

  return (
    <div
      className="
        w-full
        max-w-[1600px]
        mx-auto
        px-3 md:px-6
        pb-10
        flex flex-col gap-6
        text-neutral-100
      "
    >
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
                  {stockOverview.available_stock}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[11px] text-neutral-500">
                  Total stock value
                </p>
                <p className="text-lg font-semibold text-neutral-100">
                  {stockOverview.total_price}
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px] text-neutral-400">
                <span>Capacity used</span>
                <span className="text-neutral-200 font-medium">
                  {stockFillPercent}%
                </span>
              </div>
              <Progress
                value={stockFillPercent}
                className="h-2 bg-neutral-800 [&>div]:bg-neutral-200"
              />
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                This is based on an estimate of 200 total items target.
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
                  {profitSummary.stock_cost}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[11px] text-neutral-500">Potential profit</p>
                <p className="text-lg font-semibold text-neutral-100">
                  {profitSummary.profit}
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="space-y-2">
              <p className="text-[12px] font-medium text-neutral-300 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-400" />
                Losing products
              </p>

              {profitSummary.losing_products.length === 0 ? (
                <p className="text-[11px] text-neutral-500">
                  None of your items are losing money 🎉
                </p>
              ) : (
                <ul className="space-y-1 text-[12px] text-neutral-400">
                  {profitSummary.losing_products.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-1"
                    >
                      <span className="text-neutral-300">{p.name}</span>
                      <span className="text-red-400 font-medium">
                        -{p.loss_per_item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low stock alert */}
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
                {lowStock.length} items
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-neutral-300">
            {lowStock.length === 0 ? (
              <p className="text-[11px] text-neutral-500">
                All good. You&apos;re fully stocked 🟢
              </p>
            ) : (
              <ScrollArea className="max-h-40 pr-2">
                <ul className="space-y-2 text-[12px]">
                  {lowStock.map((item, i) => (
                    <li
                      key={i}
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
                {topLucrative.map((p, i) => (
                  <TableRow
                    key={i}
                    className="border-neutral-800/70 hover:bg-neutral-900/40"
                  >
                    <TableCell className="font-medium text-neutral-200">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-400">
                      {p.profit}
                    </TableCell>
                  </TableRow>
                ))}
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
                {worstLucrative.map((p, i) => (
                  <TableRow
                    key={i}
                    className="border-neutral-800/70 hover:bg-neutral-900/40"
                  >
                    <TableCell className="font-medium text-neutral-200">
                      {p.name}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        p.profit.startsWith("-")
                          ? "text-red-400"
                          : "text-neutral-300"
                      }`}
                    >
                      {p.profit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
