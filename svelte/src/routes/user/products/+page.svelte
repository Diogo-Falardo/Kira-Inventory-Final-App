<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
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
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  } from '$lib/components/ui/dialog';
  import {
    Sheet,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetFooter,
  } from '$lib/components/ui/sheet';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
  } from '$lib/components/ui/dropdown-menu';
  import {
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
    CircleSlash2,
    Package,
    ArrowUpAZ,
    ArrowDownAZ,
  } from '@lucide/svelte';
  //
  import {
    useMyProducts,
    usePostAddProduct,
    useInactiveProduct,
    useDeleteProduct,
  } from '$lib/api/hooks/useProduct';
  import { createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { patchUpdateProduct, type ProductUpdate } from '$lib/api/endpoints/product';

  let order = $state<'asc' | 'desc'>('desc');

  // Reactive derived value
  const list = $derived(useMyProducts(order));

  // Mutations
  const qc = useQueryClient();
  const addProduct = usePostAddProduct();
  const inactiveProduct = useInactiveProduct();
  const deleteProduct = useDeleteProduct();

  // Update mutation that accepts { id, data }
  const updateProduct = createMutation(() => ({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) => patchUpdateProduct(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  }));

  // Sheet state + form
  type FormData = {
    name: string;
    description: string;
    platform: string;
    available_stock: string;
    price: string;
    cost: string;
    img_url: string;
  };
  let openSheet = $state(false);
  let sheetMode = $state<'create' | 'edit'>('create');
  let currentId = $state<number | null>(null);

  let form = $state<FormData>({
    name: '',
    description: '',
    platform: '',
    available_stock: '',
    price: '',
    cost: '',
    img_url: '',
  });

  function openCreate() {
    sheetMode = 'create';
    currentId = null;
    form = {
      name: '',
      description: '',
      platform: '',
      available_stock: '',
      price: '',
      cost: '',
      img_url: '',
    };
    openSheet = true;
  }

  function openEdit(p: {
    id: number;
    name: string;
    description?: string | null;
    platform?: string | null;
    available_stock: number;
    price?: number | null;
    cost?: number | null;
    img_url?: string | null;
  }) {
    sheetMode = 'edit';
    currentId = p.id;
    form = {
      name: p.name ?? '',
      description: p.description ?? '',
      platform: p.platform ?? '',
      available_stock: String(p.available_stock ?? ''),
      price: p.price != null ? String(p.price) : '',
      cost: p.cost != null ? String(p.cost) : '',
      img_url: p.img_url ?? '',
    };
    openSheet = true;
  }

  // Inactive / Delete dialogs
  let openInactive = $state(false);
  let inactiveTarget: any = $state(null);

  let openDelete = $state(false);
  let deleteTarget: any = $state(null);

  function askInactive(p: any) {
    inactiveTarget = p;
    openInactive = true;
  }
  function askDelete(p: any) {
    deleteTarget = p;
    openDelete = true;
  }

  const toNum = (s: string) => (s.trim() === '' ? NaN : Number(s));
  const numOr = (s: string, fallback: number) => {
    const n = toNum(s);
    return Number.isFinite(n) ? (n as number) : fallback;
  };
  const numOpt = (s: string): number | undefined => {
    const n = toNum(s);
    return Number.isFinite(n) ? (n as number) : undefined;
  };

  async function saveProduct() {
    if (sheetMode === 'create') {
      await addProduct.mutateAsync({
        name: form.name,
        description: form.description || undefined,
        platform: form.platform || undefined,
        available_stock: numOr(form.available_stock, 0),
        price: numOr(form.price, 0),
        cost: numOpt(form.cost),
        img_url: form.img_url || undefined,
      });
    } else if (sheetMode === 'edit' && currentId != null) {
      await updateProduct.mutateAsync({
        id: currentId,
        data: {
          name: form.name || undefined,
          description: form.description || undefined,
          platform: form.platform || undefined,
          available_stock: form.available_stock !== '' ? numOr(form.available_stock, 0) : undefined,
          price: form.price !== '' ? numOr(form.price, 0) : undefined,
          cost: form.cost !== '' ? numOpt(form.cost) : undefined,
          img_url: form.img_url || undefined,
        },
      });
    }
    openSheet = false;
  }

  async function confirmInactive() {
    if (!inactiveTarget) return;
    await inactiveProduct.mutateAsync(inactiveTarget.id);
    openInactive = false;
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteProduct.mutateAsync(deleteTarget.id);
    openDelete = false;
  }

  // Small formatter
  const fmt2 = (n: number | null | undefined) => Number(n ?? 0).toFixed(2);
</script>

<div class="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-3 pb-10 text-neutral-100 md:px-6">
  <!-- Header -->
  <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div class="space-y-1">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-neutral-100">
        <Package class="h-5 w-5 text-neutral-400" />
        Products
      </h2>
      <p class="text-[13px] leading-relaxed text-neutral-500">
        Manage your active inventory, pricing and availability.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <!-- Sort (refetches list with different key) -->
      <div class="flex overflow-hidden rounded-md border border-neutral-800">
        <Button
          variant="ghost"
          size="sm"
          class={'h-9 cursor-pointer rounded-none px-3 ' +
            (order === 'desc'
              ? 'bg-neutral-800/60 text-neutral-100'
              : 'text-neutral-400 hover:text-neutral-100')}
          onclick={() => (order = 'desc')}
          title="Newest first"
        >
          <ArrowDownAZ class="mr-1 h-4 w-4" /> Desc
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class={'h-9 cursor-pointer rounded-none border-l border-neutral-800 px-3 ' +
            (order === 'asc'
              ? 'bg-neutral-800/60 text-neutral-100'
              : 'text-neutral-400 hover:text-neutral-100')}
          onclick={() => (order = 'asc')}
          title="Oldest first"
        >
          <ArrowUpAZ class="mr-1 h-4 w-4" /> Asc
        </Button>
      </div>

      <Button
        onclick={openCreate}
        class="cursor-pointer bg-neutral-200 font-medium text-neutral-900 shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)] hover:bg-white"
      >
        <Plus class="mr-2 h-4 w-4" /> Add product
      </Button>
    </div>
  </div>

  <!-- Table -->
  <Card
    class="overflow-hidden border border-neutral-800/80 bg-neutral-900/50 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm"
  >
    <CardHeader class="pb-2">
      <CardTitle class="text-sm font-medium text-neutral-300">Inventory list</CardTitle>
      <CardDescription class="text-[12px] text-neutral-500"
        >These are the items currently in your catalog.</CardDescription
      >
    </CardHeader>

    <CardContent class="p-0">
      <Table>
        <TableHeader>
          <TableRow class="border-neutral-800/70">
            <TableHead class="w-[60px] text-[12px] font-medium text-neutral-500">Img</TableHead>
            <TableHead class="min-w-[180px] text-[12px] font-medium text-neutral-500"
              >Product</TableHead
            >
            <TableHead class="hidden text-[12px] font-medium text-neutral-500 md:table-cell"
              >Platform</TableHead
            >
            <TableHead
              class="hidden text-right text-[12px] font-medium text-neutral-500 md:table-cell"
              >Stock</TableHead
            >
            <TableHead class="text-right text-[12px] font-medium text-neutral-500">Price</TableHead>
            <TableHead
              class="hidden text-right text-[12px] font-medium text-neutral-500 md:table-cell"
              >Cost</TableHead
            >
            <TableHead class="w-[90px] text-center text-[12px] font-medium text-neutral-500"
              >Status</TableHead
            >
            <TableHead class="w-[50px] text-right text-[12px] font-medium text-neutral-500" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {#if list.isLoading}
            {#each Array(4) as _, idx (idx)}
              <TableRow class="border-neutral-800/70 hover:bg-neutral-900/40">
                <TableCell>
                  <div
                    class="h-10 w-10 animate-pulse rounded-md border border-neutral-800 bg-neutral-800/40"
                  ></div>
                </TableCell>

                <TableCell>
                  <div class="flex flex-col gap-2">
                    <div class="h-3 w-28 animate-pulse rounded bg-neutral-800/60"></div>
                    <div class="h-2 w-40 animate-pulse rounded bg-neutral-800/40"></div>
                  </div>
                </TableCell>

                <TableCell class="hidden md:table-cell">
                  <div class="h-3 w-16 animate-pulse rounded bg-neutral-800/40"></div>
                </TableCell>

                <TableCell class="hidden text-right md:table-cell">
                  <div class="ml-auto h-3 w-6 animate-pulse rounded bg-neutral-800/40"></div>
                </TableCell>

                <TableCell class="text-right">
                  <div class="ml-auto h-3 w-10 animate-pulse rounded bg-neutral-800/40"></div>
                </TableCell>

                <TableCell class="hidden text-right md:table-cell">
                  <div class="ml-auto h-3 w-10 animate-pulse rounded bg-neutral-800/40"></div>
                </TableCell>

                <TableCell class="text-center">
                  <div class="mx-auto h-4 w-14 animate-pulse rounded bg-neutral-800/40"></div>
                </TableCell>

                <TableCell class="text-right">
                  <div class="ml-auto h-8 w-8 animate-pulse rounded-md bg-neutral-800/40"></div>
                </TableCell>
              </TableRow>
            {/each}
          {:else if list.isError}
            <TableRow class="border-neutral-800/70">
              <TableCell class="py-10 text-center text-red-400">{list.error.message}</TableCell>
            </TableRow>
          {:else if (list.data ?? []).length === 0}
            <TableRow class="border-neutral-800/70 hover:bg-transparent">
              <TableCell class="py-16 text-center text-[13px] text-neutral-500"
                >Your inventory is empty.</TableCell
              >
            </TableRow>
          {:else}
            {#each list.data as p (p.id)}
              {@const price = Number(p.price ?? 0)}
              {@const cost = Number(p.cost ?? 0)}
              <TableRow class="border-neutral-800/70 hover:bg-neutral-900/40">
                <TableCell>
                  <div
                    class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-neutral-800 bg-neutral-800/40 text-[10px] text-neutral-500"
                  >
                    {#if p.img_url}
                      <img src={p.img_url} alt={p.name} class="h-full w-full object-cover" />
                    {:else}
                      no-img
                    {/if}
                  </div>
                </TableCell>

                <TableCell>
                  <div class="flex flex-col">
                    <span class="text-[13px] leading-tight font-medium text-neutral-100"
                      >{p.name}</span
                    >
                    <span class="line-clamp-2 text-[11px] leading-snug text-neutral-500"
                      >{p.description ?? '—'}</span
                    >
                  </div>
                </TableCell>

                <TableCell class="hidden md:table-cell">
                  <span class="text-[12px] font-medium text-neutral-300">{p.platform ?? '-'}</span>
                </TableCell>

                <TableCell class="hidden text-right md:table-cell">
                  <span
                    class={'text-[12px] font-medium ' +
                      (p.available_stock === 0
                        ? 'text-red-400'
                        : p.available_stock < 3
                          ? 'text-yellow-400'
                          : 'text-neutral-200')}
                  >
                    {p.available_stock}
                  </span>
                </TableCell>

                <TableCell class="text-right">
                  <div class="flex flex-col items-end">
                    <span class="text-[12px] font-medium text-neutral-100">{fmt2(price)} €</span>
                    <span class="text-[10px] leading-none text-neutral-500"
                      >margin {((price - cost) / (cost === 0 ? 1 : cost)).toFixed(2)}x</span
                    >
                  </div>
                </TableCell>

                <TableCell class="hidden text-right md:table-cell">
                  <span class="text-[12px] text-neutral-400">{fmt2(cost)} €</span>
                </TableCell>

                <TableCell class="text-center">
                  {#if !p.inactive}
                    <Badge
                      class="rounded-md border border-emerald-600/30 bg-emerald-500/10 text-[10px] font-medium text-emerald-400"
                      >Active</Badge
                    >
                  {:else}
                    <Badge
                      variant="outline"
                      class="rounded-md border-neutral-700 bg-neutral-800/60 text-[10px] text-neutral-400"
                      >Inactive</Badge
                    >
                  {/if}
                </TableCell>

                <TableCell class="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8 cursor-pointer rounded-md border border-transparent p-0 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/60 hover:text-neutral-100"
                      >
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      class="min-w-40 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-xl"
                    >
                      <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2 text-[13px] text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-100"
                        onclick={() => openEdit(p)}
                      >
                        <Pencil class="h-4 w-4 text-neutral-400" />
                        <span>Edit</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2 text-[13px] text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-100"
                        onclick={() => askInactive(p)}
                      >
                        <CircleSlash2 class="h-4 w-4 text-yellow-400" />
                        <span>Set inactive</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator class="bg-neutral-800" />

                      <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2 text-[13px] text-red-400 hover:bg-red-900/30 hover:text-red-400"
                        onclick={() => askDelete(p)}
                      >
                        <Trash2 class="h-4 w-4 text-red-400" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            {/each}
          {/if}
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  <!-- Sheet (Create/Edit) -->
  <Sheet open={openSheet} onOpenChange={(o) => (openSheet = o)}>
    <SheetContent
      side="right"
      class="w-full max-w-md border-l border-neutral-800 bg-neutral-900 px-4 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
    >
      <SheetHeader>
        <SheetTitle class="text-base font-semibold text-neutral-100">
          {sheetMode === 'create' ? 'Add product' : 'Edit product'}
        </SheetTitle>
        <SheetDescription class="text-[12px] leading-relaxed text-neutral-500">
          {sheetMode === 'create'
            ? 'Create a new item in your inventory.'
            : 'Update product details, pricing or stock.'}
        </SheetDescription>
      </SheetHeader>

      <div class="mt-6 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <Label class="text-[12px] text-neutral-300">Name</Label>
          <Input
            class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            bind:value={form.name}
            placeholder="Vintage Jacket"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label class="text-[12px] text-neutral-300">Description</Label>
          <Input
            class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            bind:value={form.description}
            placeholder="90s oversized denim jacket"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label class="text-[12px] text-neutral-300">Platform</Label>
          <Input
            class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            bind:value={form.platform}
            placeholder="Vinted / Instagram / Wallapop..."
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label class="text-[12px] text-neutral-300">Image URL</Label>
          <Input
            class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            bind:value={form.img_url}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <Label class="text-[12px] text-neutral-300">Stock</Label>
            <Input
              type="number"
              bind:value={form.available_stock}
              class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label class="text-[12px] text-neutral-300">Price (€)</Label>
            <Input
              type="number"
              bind:value={form.price}
              class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label class="text-[12px] text-neutral-300">Cost (€)</Label>
            <Input
              type="number"
              bind:value={form.cost}
              class="border-neutral-700 bg-neutral-800/60 text-neutral-100 placeholder:text-neutral-500"
            />
          </div>
        </div>
      </div>

      <SheetFooter class="mt-8 flex flex-col gap-3">
        <Button
          class="w-full cursor-pointer bg-neutral-200 font-medium text-neutral-900 hover:bg-white"
          onclick={saveProduct}
          disabled={addProduct.isPending || updateProduct.isPending}
        >
          {sheetMode === 'create'
            ? addProduct.isPending
              ? 'Creating…'
              : 'Create product'
            : updateProduct.isPending
              ? 'Saving…'
              : 'Save changes'}
        </Button>
        <Button
          variant="ghost"
          class="w-full cursor-pointer border border-transparent text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/60 hover:text-neutral-200"
          onclick={() => (openSheet = false)}
        >
          Cancel
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>

  <!-- Inactive dialog -->
  <Dialog open={openInactive} onOpenChange={(o) => (openInactive = o)}>
    <DialogContent
      class="max-w-sm rounded-xl border border-neutral-800 bg-neutral-900/95 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
    >
      <DialogHeader>
        <DialogTitle class="text-base font-semibold text-neutral-100"
          >Set product inactive?</DialogTitle
        >
        <DialogDescription class="text-[12px] leading-relaxed text-neutral-500">
          This will hide <span class="font-medium text-neutral-200">{inactiveTarget?.name}</span> from
          your active listings.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <DialogClose>
          <Button
            variant="ghost"
            class="cursor-pointer border border-transparent text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/60 hover:text-neutral-200"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          class="cursor-pointer"
          onclick={confirmInactive}
          disabled={inactiveProduct.isPending}
        >
          {inactiveProduct.isPending ? 'Updating…' : 'Set inactive'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Delete dialog -->
  <Dialog open={openDelete} onOpenChange={(o) => (openDelete = o)}>
    <DialogContent
      class="max-w-sm rounded-xl border border-neutral-800 bg-neutral-900/95 text-neutral-100 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
    >
      <DialogHeader>
        <DialogTitle class="text-base font-semibold text-neutral-100">Delete product?</DialogTitle>
        <DialogDescription class="text-[12px] leading-relaxed text-neutral-500">
          This will permanently remove <span class="font-medium text-red-400"
            >{deleteTarget?.name}</span
          >.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <DialogClose>
          <Button
            variant="ghost"
            class="cursor-pointer border border-transparent text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800/60 hover:text-neutral-200"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          onclick={confirmDelete}
          class="cursor-pointer bg-red-500/90 hover:bg-red-500"
          disabled={deleteProduct.isPending}
        >
          {deleteProduct.isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
