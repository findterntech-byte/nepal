
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Edit, Trash2, Eye, Smartphone, Tablet, Headphones } from "lucide-react";

type ProductFormData = {
  title: string;
  description?: string;
  listingType: string;
  category: string;
  subcategory?: string;
  productType?: string;
  brand: string;
  model: string;
  productName?: string;
  color?: string;
  storageCapacity?: string;
  ram?: string;
  processor?: string;
  screenSize?: string;
  batteryCapacity?: string;
  cameraSpecs?: string;
  operatingSystem?: string;
  connectivity?: string[];
  displayType?: string;
  refreshRate?: string;
  price: number;
  mrp?: number;
  discountPercentage?: number;
  rentalPricePerDay?: number;
  rentalPricePerMonth?: number;
  emiAvailable?: boolean;
  emiStartingFrom?: number;
  warrantyPeriod?: string;
  warrantyType?: string;
  manufacturerWarranty?: boolean;
  extendedWarrantyAvailable?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
  expectedDeliveryDays?: number;
  keyFeatures?: string[];
  accessoriesIncluded?: string[];
  boxContents?: string[];
  compatibleDevices?: string[];
  accessoryType?: string;
  material?: string;
  isOnSale?: boolean;
  saleEndDate?: string;
  bankOffers?: string[];
  exchangeOffer?: boolean;
  exchangeDiscountUpTo?: number;
  images?: string[];
  videos?: string[];
  productBrochure?: string;
  sellerType?: string;
  shopName?: string;
  brandAuthorized?: boolean;
  contactPerson?: string;
  contactPhone: string;
  contactEmail?: string;
  alternatePhone?: string;
  whatsappAvailable?: boolean;
  country?: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  freeDelivery?: boolean;
  deliveryCharges?: number;
  sameDayDelivery?: boolean;
  codAvailable?: boolean;
  shippingOptions?: string[];
  deliveryAreas?: string[];
  bisCertified?: boolean;
  certificationDetails?: string;
  originalProduct?: boolean;
  madeIn?: string;
  launchDate?: string;
  specifications?: any;
  technicalDetails?: string;
  returnPolicy?: string;
  returnPeriodDays?: number;
  replacementPolicy?: string;
  refundAvailable?: boolean;
  customerCareNumber?: string;
  serviceCenterAvailable?: boolean;
  installationSupport?: boolean;
  availabilityStatus?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
};

export default function PhonesTabletsAccessoriesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProductFormData>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["phones-tablets-accessories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/phones-tablets-accessories");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await fetch("/api/admin/phones-tablets-accessories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phones-tablets-accessories"] });
      toast({ title: "Success", description: "Product created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const response = await fetch(`/api/admin/phones-tablets-accessories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phones-tablets-accessories"] });
      toast({ title: "Success", description: "Product updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/phones-tablets-accessories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phones-tablets-accessories"] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    reset();
    setImages([]);
    setImageError(null);
    setUploadingImages(false);
  };

  const validateImageFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowed.includes(file.type)) return "Only JPG, PNG, WEBP and GIF allowed";
    if (file.size > maxSize) return "Each image must be <= 5MB";
    return null;
  };

  const uploadImageFiles = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/admin/upload-multiple", {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((json as any)?.message || "Failed to upload images");
      }

      const urls: string[] = Array.isArray((json as any)?.files)
        ? (json as any).files.map((f: any) => f?.url).filter((u: any) => typeof u === "string")
        : [];

      if (urls.length === 0) throw new Error("Failed to upload images");
      setImages((prev) => [...prev, ...urls].slice(0, 10));
      setImageError(null);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageError(null);

    const remaining = 10 - images.length;
    if (remaining <= 0) {
      setImageError("Maximum 10 images allowed");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    for (const f of picked) {
      const err = validateImageFile(f);
      if (err) {
        setImageError(err);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    try {
      await uploadImageFiles(picked);
    } catch (e: any) {
      console.error(e);
      setImageError(e?.message || "Failed to upload images");
    }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); processFiles(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
  const openFileDialog = () => fileInputRef.current?.click();
  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setImages(product.images || []);
    setImageError(null);
    Object.keys(product).forEach((key) => {
      setValue(key as any, product[key]);
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    const payload = { ...data, images };
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phone':
        return <Smartphone className="h-5 w-5 text-blue-600" />;
      case 'tablet':
        return <Tablet className="h-5 w-5 text-green-600" />;
      case 'accessory':
        return <Headphones className="h-5 w-5 text-purple-600" />;
      default:
        return <Smartphone className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">New Phones, Tablets & Accessories</h2>
          <p className="text-muted-foreground">Manage new phone, tablet and accessory listings</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {products.map((product: any) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      {getCategoryIcon(product.category)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.title}</h3>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge variant="outline">{product.brand} {product.model}</Badge>
                          <Badge variant={product.listingType === 'sell' ? 'default' : 'secondary'}>
                            {product.listingType}
                          </Badge>
                          {product.inStock ? (
                            <Badge className="bg-green-600">In Stock</Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                          {product.isNewArrival && <Badge className="bg-blue-600">New</Badge>}
                          {product.isBestSeller && <Badge className="bg-yellow-600">Best Seller</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          ₹{Number(product.price).toLocaleString()}
                          {product.mrp && product.mrp > product.price && (
                            <span className="line-through ml-2 text-gray-500">₹{Number(product.mrp).toLocaleString()}</span>
                          )}
                          {product.discountPercentage && (
                            <span className="ml-2 text-green-600 font-semibold">{product.discountPercentage}% off</span>
                          )}
                        </p>
                        {product.city && (
                          <p className="text-sm text-muted-foreground">{product.city}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingProduct(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit" : "Add"} Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register("listingType", { required: true })} />
            <input type="hidden" {...register("category", { required: true })} />

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" {...register("title", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listingType">Listing Type *</Label>
                    <Select
                      onValueChange={(value) => setValue("listingType", value, { shouldDirty: true, shouldValidate: true })}
                      defaultValue={editingProduct?.listingType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      onValueChange={(value) => setValue("category", value, { shouldDirty: true, shouldValidate: true })}
                      defaultValue={editingProduct?.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input id="brand" {...register("brand", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" {...register("model", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" {...register("color")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storageCapacity">Storage</Label>
                    <Input id="storageCapacity" {...register("storageCapacity")} placeholder="e.g., 128GB" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ram">RAM</Label>
                    <Input id="ram" {...register("ram")} placeholder="e.g., 8GB" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input id="price" type="number" {...register("price", { required: true, valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mrp">MRP (₹)</Label>
                    <Input id="mrp" type="number" {...register("mrp", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage">Discount %</Label>
                    <Input id="discountPercentage" type="number" {...register("discountPercentage", { valueAsNumber: true })} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="emiAvailable" onCheckedChange={(checked) => setValue("emiAvailable", checked)} />
                    <Label htmlFor="emiAvailable">EMI Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => void processFiles(e.target.files)}
                />

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? "border-primary bg-muted/40" : "border-muted-foreground/30"}`}
                  onClick={openFileDialog}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="text-sm text-muted-foreground">
                    Drag & drop images here, or click to select
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Max 10 images, 5MB each</div>
                  {uploadingImages && (
                    <div className="text-xs text-muted-foreground mt-2">Uploading...</div>
                  )}
                </div>

                {imageError && (
                  <div className="text-sm text-destructive">{imageError}</div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`upload-${idx}`} className="w-full h-24  rounded" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/60 text-white"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" {...register("contactPerson")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" {...register("contactPhone", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="inStock" defaultChecked onCheckedChange={(checked) => setValue("inStock", checked)} />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isNewArrival" onCheckedChange={(checked) => setValue("isNewArrival", checked)} />
                    <Label htmlFor="isNewArrival">New Arrival</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingProduct ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingProduct && (
        <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingProduct.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Images */}
              {Array.isArray(viewingProduct.images) && viewingProduct.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {viewingProduct.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt={`${viewingProduct.title || 'product'}-${idx}`} className="w-32 h-20  rounded" />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Brand & Model</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.brand} {viewingProduct.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">₹{Number(viewingProduct.price).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Stock Status</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.inStock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                {/* Description */}
                {viewingProduct.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{viewingProduct.description}</p>
                  </div>
                )}
                {/* Contact & Location */}
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.contactPerson || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.contactPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">City</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.city || viewingProduct.areaName || viewingProduct.storageCapacity || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.fullAddress || '-'}</p>
                </div>
              </div>
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingProduct.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingProduct.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
