<script lang="ts">
  import {
    Package,
    DollarSign,
    TriangleAlert,
    TrendingUp,
    TrendingDown,
    RefreshCcw,
    Save,
    Bug,
    Plus,
    Settings,
  } from '@lucide/svelte';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Progress } from '$lib/components/ui/progress';
  import { Separator } from '$lib/components/ui/separator';
  import { ScrollArea, ScrollAreaScrollbar } from '$lib/components/ui/scroll-area';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from '$lib/components/ui/table';
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  } from '$lib/components/ui/dialog';
  //
  import {
    normalizeDashboardResponse,
    type DashboardNormalized,
  } from '$lib/api/normalizeDashboard';
  import { apiFetch } from '$lib/api/api';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let threshold = $state<number>(150);
  let capacityTarget = $state<number>(1000);
  let newCapacity = $state<number>(0);
  let data = $state<DashboardNormalized | null>(null);
  let loading = $state(true);
  let error = $state('');

  let restored = $state(false);

  $effect.root(() => {
    if (browser) {
      const t = localStorage.getItem('threshold');
      const c = localStorage.getItem('capacityTarget');
      if (t !== null && t !== '') threshold = Number(t);
      if (c !== null && c !== '') capacityTarget = Number(c);
      newCapacity = capacityTarget; // sync the dialog input
      restored = true;
    }
    loadDashboard();
  });

  $effect(() => {
    if (!browser || !restored) return;
    localStorage.setItem('threshold', String(threshold));
    localStorage.setItem('capacityTarget', String(capacityTarget));
  });

  async function loadDashboard() {
    loading = true;
    try {
      const raw = await apiFetch(`/product/dashboard?low_stock_threshold=${threshold}`);

      console.log('URL sent:', `/product/dashboard?threshold=${threshold}`);
      console.log('threshold value + typeof:', threshold, typeof threshold);
      const lowStockArr = Object.values((raw as any)?.low_stock ?? {})[0] as any[];
      console.log('raw low_stock length:', lowStockArr?.length);
      console.log('raw:', raw);

      data = normalizeDashboardResponse(raw);
      error = '';
    } catch (e: any) {
      error = e?.message ?? 'failed to load dashboard';
      data = null;
    } finally {
      loading = false;
    }
  }

  function applyThreshold() {
    loadDashboard();
  }

  function refresh() {
    loadDashboard();
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(n);

  // --- derived values ---
  let availableStock = $derived(data && !data.isEmpty ? data.availableStock : 0);
  let totalPrice = $derived(data && !data.isEmpty ? data.totalPrice : 0);
  let stockCost = $derived(data && !data.isEmpty ? data.stockCost : 0);
  let totalProfit = $derived(data && !data.isEmpty ? data.totalProfit : 0);

  let losingProducts = $derived(data && !data.isEmpty ? data.losingProducts : []);
  let lowStock = $derived(data && !data.isEmpty ? data.lowStock : []);
  let lowStockInfo = $derived(data && !data.isEmpty ? data.lowStockMessage : '');

  let capacityUsed = $derived(
    capacityTarget ? Math.round((availableStock / capacityTarget) * 100) : 0
  );

  let topProducts = $derived(data && !data.isEmpty ? data.topProducts : []);
  let worstProducts = $derived(data && !data.isEmpty ? data.worstProducts : []);
</script>

{#if loading}
  <!-- LOADING: skeletons that match your cards/grid -->
  <div class="mx-auto w-full max-w-[1600px] px-3 pb-10 md:px-6">
    <!-- Row 1 -->
    <section class="grid gap-6 xl:grid-cols-3">
      {#each Array(3) as _}
        <Card
          class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <div class="h-4 w-40 animate-pulse rounded bg-neutral-800"></div>
                <div class="h-3 w-56 animate-pulse rounded bg-neutral-800/80"></div>
              </div>
              <div class="h-5 w-12 animate-pulse rounded bg-neutral-800/80"></div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap items-baseline justify-between gap-4">
              <div class="space-y-2">
                <div class="h-3 w-28 animate-pulse rounded bg-neutral-800/80"></div>
                <div class="h-5 w-16 animate-pulse rounded bg-neutral-700"></div>
              </div>
              <div class="space-y-2 text-right">
                <div class="h-3 w-28 animate-pulse rounded bg-neutral-800/80"></div>
                <div class="h-5 w-24 animate-pulse rounded bg-neutral-700"></div>
              </div>
            </div>

            <Separator class="bg-neutral-800" />

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="h-3 w-24 animate-pulse rounded bg-neutral-800/80"></div>
                <div class="h-3 w-10 animate-pulse rounded bg-neutral-800/80"></div>
              </div>
              <div class="h-2 w-full animate-pulse rounded bg-neutral-800"></div>
              <div class="h-3 w-56 animate-pulse rounded bg-neutral-800/80"></div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </section>

    <!-- Row 2 -->
    <section class="mt-6 grid gap-6 lg:grid-cols-2">
      {#each Array(2) as _}
        <Card
          class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <div class="h-4 w-48 animate-pulse rounded bg-neutral-800"></div>
                <div class="h-3 w-60 animate-pulse rounded bg-neutral-800/80"></div>
              </div>
              <div class="h-5 w-20 animate-pulse rounded bg-neutral-800/80"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each Array(4) as _}
                <div
                  class="flex items-center justify-between border-b border-neutral-800/70 py-3 last:border-0"
                >
                  <div class="h-4 w-40 animate-pulse rounded bg-neutral-800/80"></div>
                  <div class="h-4 w-20 animate-pulse rounded bg-neutral-800/80"></div>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </section>
  </div>
{:else if error}
  <!-- ERROR: matches your red accent -->
  <div class="px-3 py-6 md:px-6">
    <Card
      class="border border-red-600/30 bg-red-600/10 text-red-300 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
    >
      <CardHeader class="pb-2">
        <CardTitle class="flex items-center gap-2 text-sm font-medium">
          <TriangleAlert class="h-4 w-4" />
          Something went wrong
        </CardTitle>
        <CardDescription class="text-xs text-red-200/80">
          {error}
        </CardDescription>
      </CardHeader>
      <CardContent class="flex gap-2 pt-1">
        <Button
          class="h-8 bg-neutral-200 px-3 text-neutral-900 hover:bg-white"
          onclick={() => window.location.reload()}
        >
          <RefreshCcw class="mr-2 h-4 w-4" /> Retry
        </Button>
        <Button
          variant="ghost"
          class="h-8 px-3 text-red-200 hover:bg-red-600/10 hover:text-red-100"
        >
          <Bug class="mr-2 h-4 w-4" /> Report
        </Button>
      </CardContent>
    </Card>
  </div>
{:else if data && data.isEmpty}
  <!-- EMPTY: soft message + CTA -->
  <div class="px-3 py-8 md:px-6">
    <Card
      class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
    >
      <CardContent class="flex flex-col items-start gap-2 p-6">
        <p class="text-lg font-semibold">No products</p>
        <p class="text-neutral-500">{data.emptyMessage}</p>
        <div class="pt-2">
          <Button class="h-9 bg-neutral-200 px-3 text-neutral-900 hover:bg-white">
            <Plus class="mr-2 h-4 w-4" /> Add your first product
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
{:else if data}
  <div
    class="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-3 pb-10 text-neutral-100 md:px-6"
  >
    <!-- ROW 1 -->
    <section class="grid gap-6 xl:grid-cols-3">
      <!-- Inventory overview -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <Package class="h-4 w-4 text-neutral-400" />
                Inventory overview
              </CardTitle>
              <CardDescription class="text-[12px] text-neutral-500">
                Snapshot of your current stock value.
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              class="border-neutral-700 bg-neutral-800/60 text-[10px] tracking-wide text-neutral-300 uppercase"
            >
              Live
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 text-sm text-neutral-300">
          <div class="flex flex-wrap items-baseline justify-between gap-4">
            <div class="space-y-1">
              <p class="text-[11px] text-neutral-500">Total items in stock</p>
              <p class="text-lg font-semibold text-neutral-100">{availableStock}</p>
            </div>

            <div class="space-y-1 text-right">
              <p class="text-[11px] text-neutral-500">Total stock value</p>
              <p class="text-lg font-semibold text-neutral-100">{formatCurrency(totalPrice)}</p>
            </div>
          </div>

          <Separator class="bg-neutral-800" />

          <div class="space-y-2">
            <div class="flex items-center justify-between text-[12px] text-neutral-400">
              <span>Capacity used</span>
              <span class="font-medium text-neutral-200">{capacityUsed}%</span>
            </div>
            <Progress value={capacityUsed} class="h-2 bg-neutral-800 [&>div]:bg-neutral-200" />
            <p class="text-[11px] leading-relaxed text-neutral-500">
              Based on a target of
              <span class="font-medium text-neutral-300">{capacityTarget}</span> total items.
            </p>
            <Dialog>
              <DialogTrigger>
                <Button
                  variant="ghost"
                  class="mt-1 h-8 w-fit px-3 text-[12px] text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-100"
                >
                  <Settings class="mr-2 h-4 w-4" /> Set Capacity
                </Button>
              </DialogTrigger>

              <DialogContent
                class="border border-neutral-800 bg-neutral-900/80 text-neutral-100 shadow-2xl backdrop-blur-md sm:max-w-[400px]"
              >
                <DialogHeader>
                  <DialogTitle class="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    <Settings class="h-4 w-4 text-neutral-400" /> Update store capacity
                  </DialogTitle>
                  <DialogDescription class="text-xs text-neutral-500">
                    Set your target total number of items in stock.
                  </DialogDescription>
                </DialogHeader>

                <div class="space-y-3 pt-2">
                  <Label for="capacity" class="text-xs text-neutral-400">Capacity target</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    bind:value={newCapacity}
                    placeholder="e.g. 2000"
                    class="h-9 w-full border-neutral-700 bg-neutral-800/70 text-neutral-100 placeholder-neutral-600"
                  />
                </div>

                <DialogFooter class="pt-4">
                  <Button
                    class="h-8 bg-neutral-200 px-3 text-neutral-900 hover:bg-white"
                    onclick={() => {
                      capacityTarget = Number(newCapacity);
                    }}
                  >
                    <Save class="mr-2 h-4 w-4" /> Save
                  </Button>
                  <DialogClose>
                    <Button
                      variant="ghost"
                      class="h-8 px-3 text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-100"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <!-- Profit summary -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <DollarSign class="h-4 w-4 text-neutral-400" />
                Profit summary
              </CardTitle>
              <CardDescription class="text-[12px] text-neutral-500">
                Overall margin based on cost / sale price.
              </CardDescription>
            </div>

            <Badge
              class="border border-emerald-600/30 bg-emerald-500/10 text-[10px] font-medium text-emerald-400"
            >
              + healthy
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 text-sm text-neutral-300">
          <div class="flex flex-wrap justify-between gap-4">
            <div class="space-y-1">
              <p class="text-[11px] text-neutral-500">Stock cost</p>
              <p class="text-lg font-semibold text-neutral-100">{formatCurrency(stockCost)}</p>
            </div>

            <div class="space-y-1 text-right">
              <p class="text-[11px] text-neutral-500">Total / potential profit</p>
              <p class="text-lg font-semibold text-neutral-100">{formatCurrency(totalProfit)}</p>
            </div>
          </div>

          <Separator class="bg-neutral-800" />

          <div class="space-y-2">
            <p class="flex items-center gap-2 text-[12px] font-medium text-neutral-300">
              <TrendingDown class="h-4 w-4 text-red-400" />
              Losing products
            </p>

            {#if losingProducts.length}
              <ul class="space-y-1 text-[12px] text-neutral-400">
                {#each losingProducts as p, i (p.name + i)}
                  <li
                    class="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-1"
                  >
                    <span class="text-neutral-300">{p.name}</span>
                    <span class="font-medium text-red-400">-{formatCurrency(p.lossPerItem)}</span>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="text-[11px] text-neutral-500">None of your items are losing money 🎉</p>
            {/if}
          </div>
        </CardContent>
      </Card>

      <!-- Low stock alerts -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <TriangleAlert class="h-4 w-4 text-yellow-400" />
                Low stock alerts
              </CardTitle>
              <CardDescription class="text-[12px] text-neutral-500">
                Items that need restocking soon.
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              class="border-yellow-500/30 bg-yellow-500/10 text-[10px] tracking-wide text-yellow-400 uppercase"
            >
              {lowStock.length} items
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="space-y-3 text-sm text-neutral-300">
          <div class="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              bind:value={threshold}
              class="h-8 w-24 border-neutral-700 bg-neutral-800/60 text-neutral-100"
            />
            <Button
              class="h-8 bg-neutral-200 px-3 text-neutral-900 hover:bg-white"
              onclick={applyThreshold}
            >
              <Save class="mr-2 h-4 w-4" /> Apply
            </Button>
            <Button
              variant="ghost"
              class="h-8 px-3 text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-100"
              onclick={refresh}
            >
              <RefreshCcw class="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>

          {#if lowStock.length}
            <ScrollArea class="h-48 pr-2">
              <div class="pr-2">
                <ul class="space-y-2 text-[12px]">
                  {#each lowStock as item, i (item.name + i)}
                    <li
                      class="flex flex-col rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-2"
                    >
                      <span class="font-medium text-neutral-100">{item.name}</span>
                      <span class="text-[11px] text-neutral-500">
                        Stock available:
                        <span
                          class={item.stock === 0
                            ? 'font-medium text-red-400'
                            : 'font-medium text-yellow-400'}
                        >
                          {item.stock}
                        </span>
                      </span>
                    </li>
                  {/each}
                </ul>
              </div>

              <ScrollAreaScrollbar orientation="vertical" />
            </ScrollArea>
          {:else}
            <p class="text-[11px] text-neutral-500">All good. You’re fully stocked 🟢</p>
          {/if}
        </CardContent>
      </Card>
    </section>

    <!-- ROW 2 -->
    <section class="grid gap-6 lg:grid-cols-2">
      <!-- Top products -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <TrendingUp class="h-4 w-4 text-emerald-400" />
                Top products (profit)
              </CardTitle>
              <CardDescription class="text-[12px] text-neutral-500"
                >Best performing items by margin.</CardDescription
              >
            </div>
            <Badge
              class="border border-emerald-600/30 bg-emerald-500/10 text-[10px] font-medium text-emerald-400"
              >Good sellers</Badge
            >
          </div>
        </CardHeader>

        <CardContent class="text-sm text-neutral-300">
          <Table>
            <TableHeader>
              <TableRow class="border-neutral-800/70">
                <TableHead class="text-[12px] font-medium text-neutral-500">Product</TableHead>
                <TableHead class="text-right text-[12px] font-medium text-neutral-500"
                  >Profit</TableHead
                >
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each topProducts as p, i (p.name + i)}
                <TableRow class="border-neutral-800/70 hover:bg-neutral-900/40">
                  <TableCell class="font-medium text-neutral-200">{p.name}</TableCell>
                  <TableCell class="text-right font-medium text-emerald-400"
                    >{formatCurrency(p.profit)}</TableCell
                  >
                </TableRow>
              {/each}
              {#if !topProducts.length}
                <TableRow class="border-neutral-800/70 hover:bg-transparent">
                  <TableCell class="py-6 text-center text-[12px] text-neutral-500"
                    >No data yet.</TableCell
                  >
                </TableRow>
              {/if}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Worst products -->
      <Card
        class="border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <TrendingDown class="h-4 w-4 text-red-400" />
                Worst products (loss)
              </CardTitle>
              <CardDescription class="text-[12px] text-neutral-500"
                >Items hurting your margin.</CardDescription
              >
            </div>
            <Badge
              variant="outline"
              class="border-red-600/30 bg-red-600/10 text-[10px] font-medium text-red-400"
              >Review</Badge
            >
          </div>
        </CardHeader>

        <CardContent class="text-sm text-neutral-300">
          <Table>
            <TableHeader>
              <TableRow class="border-neutral-800/70">
                <TableHead class="text-[12px] font-medium text-neutral-500">Product</TableHead>
                <TableHead class="text-right text-[12px] font-medium text-neutral-500"
                  >Profit / Loss</TableHead
                >
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each worstProducts as p, i (p.name + i)}
                <TableRow class="border-neutral-800/70 hover:bg-neutral-900/40">
                  <TableCell class="font-medium text-neutral-200">{p.name}</TableCell>
                  <TableCell class="text-right font-medium">
                    {formatCurrency(p.profit)}
                  </TableCell>
                </TableRow>
              {/each}
              {#if !worstProducts.length}
                <TableRow class="border-neutral-800/70 hover:bg-transparent">
                  <TableCell class="py-6 text-center text-[12px] text-neutral-500"
                    >No data yet.</TableCell
                  >
                </TableRow>
              {/if}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  </div>
{/if}
