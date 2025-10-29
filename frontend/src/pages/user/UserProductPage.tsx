import * as React from "react";
import { useState, useEffect } from "react";

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
} from "lucide-react";

// tipo do produto na tabela
type Product = {
  id: number;
  name: string;
  description: string;
  platform: string;
  available_stock: number;
  price: number;
  cost: number;
  img_url?: string | null;
  active: boolean;
  created_at?: string;
};

// componente
export default function UserPanel() {
  // --------------------------
  // ESTADO PRINCIPAL
  // --------------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // sheet state (create / edit)
  const [openSheet, setOpenSheet] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // delete confirm dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // inactivate confirm dialog
  const [openInactive, setOpenInactive] = useState(false);
  const [inactiveTarget, setInactiveTarget] = useState<Product | null>(null);

  // form local state (mock para criar/editar)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "",
    available_stock: 0,
    price: 0,
    cost: 0,
    img_url: "",
  });

  // --------------------------
  // FETCH inicial dos produtos
  // --------------------------
  useEffect(() => {
    async function fetchProducts() {
      try {
        // TODO: mete aqui o fetch real
        // const res = await fetch(
        //   "http://localhost:8081/product/my-products?order=desc",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // const data = await res.json();

        // MOCK DO RESPONSE (igual ao swagger que mandaste)
        const data = [
          {
            id: 3,
            name: "Mini Handbag",
            description: "Pastel shoulder bag",
            platform: "Wallapop",
            available_stock: 0,
            price: "25.00",
            cost: "6.00",
            img_url: null,
            active: false,
            created_at: "2025-10-25T13:45:00Z",
          },
          {
            id: 2,
            name: "Nike Air Max Pink",
            description: "Lightly used, size 38",
            platform: "Instagram",
            available_stock: 1,
            price: "80.00",
            cost: "40.00",
            img_url:
              "https://images.unsplash.com/photo-1584735174914-6b3704a3a29f?w=200&q=80",
            active: true,
            created_at: "2025-10-25T13:44:00Z",
          },
          {
            id: 1,
            name: "Vintage Jacket",
            description: "90s oversized denim jacket",
            platform: "Vinted",
            available_stock: 4,
            price: "45.00",
            cost: "12.00",
            img_url:
              "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80",
            active: true,
            created_at: "2025-10-25T13:42:38Z",
          },
        ];

        // adapt -> garante que price/cost ficam number
        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          platform: p.platform,
          available_stock: p.available_stock,
          price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
          cost: typeof p.cost === "string" ? parseFloat(p.cost) : p.cost,
          img_url: p.img_url,
          active: p.active,
          created_at: p.created_at,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("failed to load products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // --------------------------
  // UI handlers
  // --------------------------

  function handleAddNew() {
    setSheetMode("create");
    setFormData({
      name: "",
      description: "",
      platform: "",
      available_stock: 0,
      price: 0,
      cost: 0,
      img_url: "",
    });
    setCurrentProduct(null);
    setOpenSheet(true);
  }

  function handleEditProduct(p: Product) {
    setSheetMode("edit");
    setCurrentProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      platform: p.platform,
      available_stock: p.available_stock,
      price: p.price,
      cost: p.cost,
      img_url: p.img_url ?? "",
    });
    setOpenSheet(true);
  }

  function handleInactiveProduct(p: Product) {
    setInactiveTarget(p);
    setOpenInactive(true);
  }

  function handleDeleteProduct(p: Product) {
    setDeleteTarget(p);
    setOpenDelete(true);
  }

  // create / edit submit (mock)
  function saveProduct() {
    if (sheetMode === "create") {
      // POST /product/add-product
      const newId =
        products.length === 0
          ? 1
          : Math.max(...products.map((pp) => pp.id)) + 1;

      const newProduct: Product = {
        id: newId,
        active: true,
        created_at: new Date().toISOString(),
        ...formData,
      };

      setProducts((prev) => [newProduct, ...prev]);
    } else if (sheetMode === "edit" && currentProduct) {
      // PATCH /product/update-product/{product_id}
      setProducts((prev) =>
        prev.map((p) =>
          p.id === currentProduct.id
            ? {
                ...p,
                ...formData,
              }
            : p
        )
      );
    }

    setOpenSheet(false);
  }

  function confirmInactive() {
    if (inactiveTarget) {
      // PUT /product/inactive-product/{product_id}
      setProducts((prev) =>
        prev.map((p) =>
          p.id === inactiveTarget.id ? { ...p, active: false } : p
        )
      );
    }
    setOpenInactive(false);
  }

  function confirmDelete() {
    if (deleteTarget) {
      // DELETE /product/delete-product/{product_id}
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }
    setOpenDelete(false);
  }

  // --------------------------
  // RENDER
  // --------------------------

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 pb-10 text-neutral-100 flex flex-col gap-6">
      {/* header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
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
          <Button
            onClick={handleAddNew}
            className="bg-neutral-200 text-neutral-900 hover:bg-white font-medium shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

      {/* main card */}
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
                // skeleton rows enquanto carrega
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
                    Your inventory is empty. Add your first product.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-neutral-800/70 hover:bg-neutral-900/40"
                  >
                    {/* img */}
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

                    {/* name/desc */}
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-neutral-100 leading-tight">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 leading-snug line-clamp-2">
                          {p.description || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* platform */}
                    <TableCell className="align-top hidden md:table-cell">
                      <span className="text-[12px] text-neutral-300 font-medium">
                        {p.platform || "-"}
                      </span>
                    </TableCell>

                    {/* stock */}
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

                    {/* price */}
                    <TableCell className="align-top text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[12px] font-medium text-neutral-100">
                          {p.price.toFixed(2)} €
                        </span>
                        <span className="text-[10px] text-neutral-500 leading-none">
                          margin{" "}
                          {(
                            (p.price - p.cost) /
                            (p.cost === 0 ? 1 : p.cost)
                          ).toFixed(2)}
                          x
                        </span>
                      </div>
                    </TableCell>

                    {/* cost */}
                    <TableCell className="align-top text-right hidden md:table-cell">
                      <span className="text-[12px] text-neutral-400">
                        {p.cost.toFixed(2)} €
                      </span>
                    </TableCell>

                    {/* status */}
                    <TableCell className="align-top text-center">
                      {p.active ? (
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

                    {/* actions */}
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
                          className="min-w-[160px] rounded-md bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-xl"
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sheet Add/Edit */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent
          side="right"
          className="w-full max-w-md bg-neutral-900 text-neutral-100 border-l border-neutral-800 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
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
                  className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  value={formData.available_stock}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      available_stock: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[12px] text-neutral-300">
                  Price (€)
                </Label>
                <Input
                  type="number"
                  className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[12px] text-neutral-300">Cost (€)</Label>
                <Input
                  type="number"
                  className="bg-neutral-800/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      cost: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8 flex flex-col gap-3">
            <Button
              className="w-full bg-neutral-200 text-neutral-900 hover:bg-white font-medium shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)]"
              onClick={saveProduct}
            >
              {sheetMode === "create" ? "Create product" : "Save changes"}
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

      {/* Dialog Inactive */}
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
              from your active listings, but you&apos;ll still keep it in
              records.
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
              className="cursor-pointer bg-yellow-500/10 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-500/20 font-medium"
            >
              Set inactive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
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

            <Button
              onClick={confirmDelete}
              className="cursor-pointer bg-red-600/10 text-red-400 border border-red-600/30 hover:bg-red-600/20 font-medium"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
