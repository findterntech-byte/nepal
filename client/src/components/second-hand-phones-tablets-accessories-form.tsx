
import { useState, useRef, useEffect } from "react";
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
  brand: string;
  model: string;
  variant?: string;
  color?: string;
  storageCapacity?: string;
  ram?: string;
  condition: string;
  usageDuration?: string;
  purchaseDate?: string;
  price: number;
  originalPrice?: number;
  negotiable?: boolean;
  exchangeAccepted?: boolean;
  warrantyAvailable?: boolean;
  billAvailable?: boolean;
  boxAvailable?: boolean;
  originalAccessories?: boolean;
  screenCondition?: string;
  bodyCondition?: string;
  batteryHealth?: string;
  waterDamage?: boolean;
  imeiNumber?: string;
  reasonForSelling?: string;
  contactPerson?: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  city?: string;
  deliveryAvailable?: boolean;
  testingAllowed?: boolean;
  urgentSale?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
};

export default function SecondHandPhonesTabletsAccessoriesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProductFormData>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["second-hand-phones-tablets-accessories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/second-hand-phones-tablets-accessories");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await fetch("/api/admin/second-hand-phones-tablets-accessories", {
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
      queryClient.invalidateQueries({ queryKey: ["second-hand-phones-tablets-accessories"] });
      toast({ title: "Success", description: "Product created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const response = await fetch(`/api/admin/second-hand-phones-tablets-accessories/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["second-hand-phones-tablets-accessories"] });
      toast({ title: "Success", description: "Product updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/second-hand-phones-tablets-accessories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["second-hand-phones-tablets-accessories"] });
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
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    Object.keys(product).forEach((key) => {
      setValue(key as any, product[key]);
    });
    // load existing images into preview when editing
    setImages(product.images || []);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    const payload: ProductFormData = { ...data, images } as ProductFormData;
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

  const getConditionBadge = (condition: string) => {
    const colors: Record<string, string> = {
      like_new: 'bg-green-600',
      excellent: 'bg-blue-600',
      good: 'bg-yellow-600',
      fair: 'bg-orange-600',
      poor: 'bg-red-600',
    };
    return colors[condition] || 'bg-gray-600';
  };

  const validateImageFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowed.includes(file.type)) return "Only JPG, PNG, WEBP, GIF files are allowed";
    if (file.size > maxSize) return "Each image must be 5MB or smaller";
    return null;
  };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const res = await fetch('/api/upload-multiple', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const urls = Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === 'string') : [];
    if (urls.length === 0) throw new Error('Upload failed: missing files');
    return urls as string[];
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    setImageError(null);
    const accepted: File[] = [];
    Array.from(files).forEach((file) => {
      const err = validateImageFile(file);
      if (err) {
        setImageError(err);
        return;
      }
      accepted.push(file);
    });
    if (accepted.length === 0) return;

    uploadMultipleFiles(accepted)
      .then((urls) => {
        setImages((prev) => {
          const merged = [...prev, ...urls];
          return merged.slice(0, 10);
        });
      })
      .catch((e) => {
        console.error(e);
        setImageError(e instanceof Error ? e.message : 'Failed to upload images');
      });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    if (!isDialogOpen) setImages([]);
  }, [isDialogOpen]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Second Hand Phones, Tablets & Accessories</h2>
          <p className="text-muted-foreground">Manage second-hand phone, tablet and accessory listings</p>
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
                          <Badge className={getConditionBadge(product.condition)}>
                            {product.condition.replace('_', ' ')}
                          </Badge>
                          <Badge variant={product.listingType === 'sell' ? 'default' : 'secondary'}>
                            {product.listingType}
                          </Badge>
                          {product.urgentSale && <Badge className="bg-red-600">Urgent</Badge>}
                          {product.warrantyAvailable && <Badge className="bg-green-600">Warranty</Badge>}
                          {product.billAvailable && <Badge className="bg-blue-600">Bill</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          ₹{Number(product.price).toLocaleString()}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="line-through ml-2 text-gray-500">₹{Number(product.originalPrice).toLocaleString()}</span>
                          )}
                          {product.negotiable && (
                            <span className="ml-2 text-blue-600 font-semibold">Negotiable</span>
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
            <DialogTitle>{editingProduct ? "Edit" : "Add"} Second Hand Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <Select onValueChange={(value) => setValue("listingType", value)} defaultValue={editingProduct?.listingType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="exchange">Exchange</SelectItem>
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

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => processFiles(e.target.files)}
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-dashed border-2 rounded p-4 text-center ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
                >
                  <p className="text-sm text-muted-foreground">Drag & drop images here, or</p>
                  <div className="mt-2">
                    <Button type="button" onClick={openFileDialog}>Select Images</Button>
                  </div>
                  {imageError && <p className="text-sm text-red-600 mt-2">{imageError}</p>}
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {images.map((src, i) => (
                      <div key={i} className="relative">
                        <img src={src} alt={`img-${i}`} className="h-24 w-full  rounded" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => removeImage(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                    <Select onValueChange={(value) => setValue("category", value)} defaultValue={editingProduct?.category}>
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

            {/* Condition */}
            <Card>
              <CardHeader>
                <CardTitle>Condition & Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select onValueChange={(value) => setValue("condition", value)} defaultValue={editingProduct?.condition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usageDuration">Usage Duration</Label>
                    <Input id="usageDuration" {...register("usageDuration")} placeholder="e.g., 1 year" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenCondition">Screen Condition</Label>
                    <Input id="screenCondition" {...register("screenCondition")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyCondition">Body Condition</Label>
                    <Input id="bodyCondition" {...register("bodyCondition")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batteryHealth">Battery Health</Label>
                    <Input id="batteryHealth" {...register("batteryHealth")} placeholder="e.g., 85%" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reasonForSelling">Reason for Selling</Label>
                    <Input id="reasonForSelling" {...register("reasonForSelling")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="waterDamage" onCheckedChange={(checked) => setValue("waterDamage", checked)} />
                    <Label htmlFor="waterDamage">Water Damage</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="billAvailable" onCheckedChange={(checked) => setValue("billAvailable", checked)} />
                    <Label htmlFor="billAvailable">Bill Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="boxAvailable" onCheckedChange={(checked) => setValue("boxAvailable", checked)} />
                    <Label htmlFor="boxAvailable">Box Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="warrantyAvailable" onCheckedChange={(checked) => setValue("warrantyAvailable", checked)} />
                    <Label htmlFor="warrantyAvailable">Warranty Available</Label>
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
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input id="originalPrice" type="number" {...register("originalPrice", { valueAsNumber: true })} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="negotiable" onCheckedChange={(checked) => setValue("negotiable", checked)} />
                    <Label htmlFor="negotiable">Negotiable</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="exchangeAccepted" onCheckedChange={(checked) => setValue("exchangeAccepted", checked)} />
                    <Label htmlFor="exchangeAccepted">Exchange Accepted</Label>
                  </div>
                </div>
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

                  <div className="flex items-center space-x-2">
                    <Switch id="whatsappAvailable" onCheckedChange={(checked) => setValue("whatsappAvailable", checked)} />
                    <Label htmlFor="whatsappAvailable">WhatsApp Available</Label>
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
                    <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="urgentSale" onCheckedChange={(checked) => setValue("urgentSale", checked)} />
                    <Label htmlFor="urgentSale">Urgent Sale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="deliveryAvailable" onCheckedChange={(checked) => setValue("deliveryAvailable", checked)} />
                    <Label htmlFor="deliveryAvailable">Delivery Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="testingAllowed" defaultChecked onCheckedChange={(checked) => setValue("testingAllowed", checked)} />
                    <Label htmlFor="testingAllowed">Testing Allowed</Label>
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
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-sm text-muted-foreground">{viewingProduct.condition.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">₹{Number(viewingProduct.price).toLocaleString()}</p>
                </div>
                {viewingProduct.description && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{viewingProduct.description}</p>
                  </div>
                )}
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
