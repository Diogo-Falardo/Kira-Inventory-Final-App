import { useState } from "react";
// ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  CircleSlash2,
  Package,
  ArrowUpAZ,
  ArrowDownAZ,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

// hooks
import {
  useMyProducts,
  usePostAddProduct,
  usePatchUpdateProduct,
  useInactiveProduct,
  useDeleteProduct,
} from "@/app/hooks/useProduct";

// types
import type { ProductOut } from "@/app/endpoints/product";

// api + toast
import { getApiErrorMessage } from "@/app/api";
import { toast } from "react-toastify";

// helpers

// parse string -> number ("" => NaN)
const toNum = (s: string) => (s?.trim() === "" ? NaN : Number(s));
// always return number (fallback if NaN)
const numOr = (s: string, fallback: number): number => {
  const n = toNum(s);
  return Number.isFinite(n) ? (n as number) : fallback;
};
// optional number (undefined if NaN)
const numOpt = (s: string): number | undefined => {
  const n = toNum(s);
  return Number.isFinite(n) ? (n as number) : undefined;
};

type FormData = {
  name: string;
  description: string;
  platform: string;
  available_stock: string;
  price: string;
  cost: string;
  img_url: string;
};

export default function UserPanel() {
  const qc = useQueryClient();
  const [order, setOrder] = useState<"desc" | "asc">("desc");

  const { data: products = [], isLoading: loading } = useMyProducts(order);

  // sheet state
  const [openSheet, setOpenSheet] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [currentProduct, setCurrentProduct] = useState<ProductOut | null>(null);

  // dialogs
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductOut | null>(null);
  const [openInactive, setOpenInactive] = useState(false);
  const [inactiveTarget, setInactiveTarget] = useState<ProductOut | null>(null);

  // local form state (strings to avoid "0" in number inputs)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    platform: "",
    available_stock: "",
    price: "",
    cost: "",
    img_url: "",
  });

  // open create sheet
  function handleAddNew() {
    setSheetMode("create");
    setFormData({
      name: "",
      description: "",
      platform: "",
      available_stock: "",
      price: "",
      cost: "",
      img_url: "",
    });
    setCurrentProduct(null);
    setOpenSheet(true);
  }

  // open edit sheet
  function handleEditProduct(p: ProductOut) {
    setSheetMode("edit");
    setCurrentProduct(p);
    setFormData({
      name: p.name ?? "",
      description: p.description ?? "",
      platform: p.platform ?? "",
      available_stock:
        p.available_stock != null ? String(p.available_stock) : "",
      price: p.price != null ? String(p.price) : "",
      cost: p.cost != null ? String(p.cost) : "",
      img_url: p.img_url ?? "",
    });
    setOpenSheet(true);
  }

  function handleInactiveProduct(p: ProductOut) {
    setInactiveTarget(p);
    setOpenInactive(true);
  }

  function handleDeleteProduct(p: ProductOut) {
    setDeleteTarget(p);
    setOpenDelete(true);
  }

  // mutations
  const addProduct = usePostAddProduct();
  const updateProduct = usePatchUpdateProduct(currentProduct?.id ?? 0);
  const inactiveProduct = useInactiveProduct();
  const deleteProduct = useDeleteProduct();

  // refetch
  function refreshList() {
    qc.invalidateQueries({ queryKey: ["my-products"] });
  }

  // create / update submit
  async function saveProduct() {
    try {
      if (sheetMode === "create") {
        await addProduct.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
          platform: formData.platform || undefined,
          available_stock: numOr(formData.available_stock, 0),
          price: numOr(formData.price, 0),
          cost: numOpt(formData.cost),
          img_url: formData.img_url || undefined,
        });
        toast.success("Product created!");
      } else if (sheetMode === "edit" && currentProduct) {
        await updateProduct.mutateAsync({
          name: formData.name || undefined,
          description: formData.description || undefined,
          platform: formData.platform || undefined,
          available_stock:
            formData.available_stock !== ""
              ? numOr(formData.available_stock, 0)
              : undefined,
          price: formData.price !== "" ? numOr(formData.price, 0) : undefined,
          cost: formData.cost !== "" ? numOpt(formData.cost) : undefined,
          img_url: formData.img_url || undefined,
        });
        toast.success("Product updated!");
      }
      setOpenSheet(false);
      refreshList();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  // confirm inactive
  async function confirmInactive() {
    try {
      if (!inactiveTarget) return;
      await inactiveProduct.mutateAsync(inactiveTarget.id);
      setOpenInactive(false);
      toast.success("Product status toggled.");
      refreshList();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  // confirm delete
  async function confirmDelete() {
    try {
      if (!deleteTarget) return;
      await deleteProduct.mutateAsync(deleteTarget.id);
      setOpenDelete(false);
      toast.success("Product deleted.");
      refreshList();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 pb-10 text-neutral-100 flex flex-col gap-6">
      {/* header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            <Package className="h-5 w-5 text-neutral-400" />
            Products
          </h2>
          <p className="text-[13px] text-neutral-500 leading-relaxed">
            Manage your active inventory, pricing and availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* sort */}
          <div className="flex rounded-md border border-neutral-800 overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`h-9 px-3 rounded-none ${
                order === "desc"
                  ? "bg-neutral-800/60 text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOrder("desc")}
              title="Newest first"
            >
              <ArrowDownAZ className="h-4 w-4 mr-1" />
              Desc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-9 px-3 rounded-none border-l border-neutral-800 ${
                order === "asc"
                  ? "bg-neutral-800/60 text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
              onClick={() => setOrder("asc")}
              title="Oldest first"
            >
              <ArrowUpAZ className="h-4 w-4 mr-1" />
              Asc
            </Button>
          </div>

          <Button
            onClick={handleAddNew}
            className="bg-neutral-200 text-neutral-900 hover:bg-white font-medium shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

      {/* table */}
      <Card className="bg-neutral-900/50 border border-neutral-800/80 text-neutral-100 backdrop-blur-sm shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Inventory list
          </CardTitle>
          <CardDescription className="text-[12px] text-neutral-500">
            These are the items currently in your catalog.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800/70">
                <TableHead className="text-neutral-500 font-medium text-[12px] w-[60px]">
                  Img
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] min-w-[180px]">
                  Product
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] hidden md:table-cell">
                  Platform
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] text-right hidden md:table-cell">
                  Stock
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] text-right">
                  Price
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] text-right hidden md:table-cell">
                  Cost
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] text-center w-[90px]">
                  Status
                </TableHead>
                <TableHead className="text-neutral-500 font-medium text-[12px] text-right w-[50px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow
                    key={idx}
                    className="border-neutral-800/70 hover:bg-neutral-900/40"
                  >
                    <TableCell className="align-top">
                      <div className="h-10 w-10 rounded-md bg-neutral-800/40 border border-neutral-800 animate-pulse" />
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-28 bg-neutral-800/60 rounded animate-pulse" />
                        <div className="h-2 w-40 bg-neutral-800/40 rounded animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="align-top hidden md:table-cell">
                      <div className="h-3 w-16 bg-neutral-800/40 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="align-top text-right hidden md:table-cell">
                      <div className="h-3 w-6 bg-neutral-800/40 rounded ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <div className="h-3 w-10 bg-neutral-800/40 rounded ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell className="align-top text-right hidden md:table-cell">
                      <div className="h-3 w-10 bg-neutral-800/40 rounded ml-auto animate-pulse" />
                    </TableCell>
                    <TableCell className="align-top text-center">
                      <div className="h-4 w-14 bg-neutral-800/40 rounded mx-auto animate-pulse" />
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <div className="h-8 w-8 bg-neutral-800/40 rounded-md ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow className="border-neutral-800/70 hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="py-16 text-center text-[13px] text-neutral-500"
                  >
                    Your inventory is empty.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => {
                  const price = Number(p.price ?? 0);
                  const cost = Number(p.cost ?? 0);

                  return (
                    <TableRow
                      key={p.id}
                      className="border-neutral-800/70 hover:bg-neutral-900/40"
                    >
                      <TableCell className="align-top">
                        <div className="h-10 w-10 rounded-md border border-neutral-800 bg-neutral-800/40 overflow-hidden flex items-center justify-center text-[10px] text-neutral-500">
                          {p.img_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.img_url}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            "no-img"
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-neutral-100 leading-tight">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-neutral-500 leading-snug line-clamp-2">
                            {p.description ?? "—"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top hidden md:table-cell">
                        <span className="text-[12px] text-neutral-300 font-medium">
                          {p.platform ?? "-"}
                        </span>
                      </TableCell>

                      <TableCell className="align-top text-right hidden md:table-cell">
                        <span
                          className={
                            "text-[12px] font-medium " +
                            (p.available_stock === 0
                              ? "text-red-400"
                              : p.available_stock < 3
                                ? "text-yellow-400"
                                : "text-neutral-200")
                          }
                        >
                          {p.available_stock}
                        </span>
                      </TableCell>

                      <TableCell className="align-top text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[12px] font-medium text-neutral-100">
                            {price.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-neutral-500 leading-none">
                            margin{" "}
                            {((price - cost) / (cost === 0 ? 1 : cost)).toFixed(
                              2
                            )}
                            x
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top text-right hidden md:table-cell">
                        <span className="text-[12px] text-neutral-400">
                          {cost.toFixed(2)} €
                        </span>
                      </TableCell>

                      <TableCell className="align-top text-center">
                        {!p.inactive ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-600/30 text-[10px] font-medium rounded-md">
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-neutral-700 bg-neutral-800/60 text-[10px] text-neutral-400 rounded-md"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="align-top text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700 p-0 cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="min-w-40 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-xl"
                          >
                            <DropdownMenuItem
                              className="text-[13px] text-neutral-300 flex items-center gap-2 cursor-pointer hover:bg-neutral-800/60 hover:text-neutral-100"
                              onClick={() => handleEditProduct(p)}
                            >
                              <Pencil className="h-4 w-4 text-neutral-400" />
                              <span>Edit</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-[13px] text-neutral-300 flex items-center gap-2 cursor-pointer hover:bg-neutral-800/60 hover:text-neutral-100"
                              onClick={() => handleInactiveProduct(p)}
                            >
                              <CircleSlash2 className="h-4 w-4 text-yellow-400" />
                              <span>Set inactive</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-neutral-800" />

                            <DropdownMenuItem
                              className="text-[13px] text-red-400 flex items-center gap-2 cursor-pointer hover:bg-red-900/30 hover:text-red-400"
                              onClick={() => handleDeleteProduct(p)}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent
          side="right"
          className="w-full max-w-md px-4 bg-neutral-900 text-neutral-100 border-l border-neutral-800 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
        >
          <SheetHeader>
            <SheetTitle className="text-neutral-100 text-base font-semibold">
              {sheetMode === "create" ? "Add product" : "Edit product"}
            </SheetTitle>
            <SheetDescription className="text-[12px] text-neutral-500 leading-relaxed">
              {sheetMode === "create"
                ? "Create a new item in your inventory."
                : "Update product details, pricing or stock."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-[12px] text-neutral-300">Name</Label>
              <Input
                className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Vintage Jacket"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[12px] text-neutral-300">
                Description
              </Label>
              <Input
                className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="90s oversized denim jacket"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[12px] text-neutral-300">Platform</Label>
              <Input
                className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                value={formData.platform}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, platform: e.target.value }))
                }
                placeholder="Vinted / Instagram / Wallapop..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[12px] text-neutral-300">Image URL</Label>
              <Input
                className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                value={formData.img_url}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, img_url: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-[12px] text-neutral-300">Stock</Label>
                <Input
                  type="number"
                  value={formData.available_stock}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      available_stock: e.target.value,
                    }))
                  }
                  className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[12px] text-neutral-300">
                  Price (€)
                </Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, price: e.target.value }))
                  }
                  className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[12px] text-neutral-300">Cost (€)</Label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, cost: e.target.value }))
                  }
                  className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8 flex flex-col gap-3">
            <Button
              className="w-full bg-neutral-200 text-neutral-900 hover:bg-white font-medium"
              onClick={saveProduct}
              disabled={addProduct.isPending || updateProduct.isPending}
            >
              {sheetMode === "create"
                ? addProduct.isPending
                  ? "Creating..."
                  : "Create product"
                : updateProduct.isPending
                  ? "Saving..."
                  : "Save changes"}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700"
              onClick={() => setOpenSheet(false)}
            >
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* inactive dialog */}
      <Dialog open={openInactive} onOpenChange={setOpenInactive}>
        <DialogContent className="bg-neutral-900/95 text-neutral-100 border border-neutral-800 rounded-xl shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-neutral-100 text-base font-semibold">
              Set product inactive?
            </DialogTitle>
            <DialogDescription className="text-[12px] text-neutral-500 leading-relaxed">
              This will hide{" "}
              <span className="text-neutral-200 font-medium">
                {inactiveTarget?.name}
              </span>{" "}
              from your active listings, but you will still keep it in records.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="cursor-pointer text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={confirmInactive}
              disabled={inactiveProduct.isPending}
            >
              {inactiveProduct.isPending ? "Updating..." : "Set inactive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="bg-neutral-900/95 text-neutral-100 border border-neutral-800 rounded-xl shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-neutral-100 text-base font-semibold">
              Delete product?
            </DialogTitle>
            <DialogDescription className="text-[12px] text-neutral-500 leading-relaxed">
              This will permanently remove{" "}
              <span className="text-red-400 font-medium">
                {deleteTarget?.name}
              </span>{" "}
              from your inventory. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="cursor-pointer text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button onClick={confirmDelete} disabled={deleteProduct.isPending}>
              {deleteProduct.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
