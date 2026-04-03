
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
import { X, Plus, Edit, Trash2, Eye, Smartphone } from "lucide-react";

type ElectronicsGadgetFormData = {
  title: string;
  description?: string;
  listingType: string;
  category: string;
  subcategory?: string;
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
  condition: string;
  usageDuration?: string;
  purchaseDate?: string;
  price: number;
  originalPrice?: number;
  rentalPricePerDay?: number;
  rentalPricePerMonth?: number;
  isNegotiable?: boolean;
  warrantyAvailable?: boolean;
  warrantyPeriod?: string;
  warrantyType?: string;
  billAvailable?: boolean;
  boxAvailable?: boolean;
  accessoriesIncluded?: string[];
  chargerIncluded?: boolean;
  originalAccessories?: boolean;
  screenCondition?: string;
  bodyCondition?: string;
  functionalIssues?: string[];
  repairsDone?: string;
  waterDamage?: boolean;
  exchangeAccepted?: boolean;
  exchangePreferences?: string;
  images?: string[];
  videos?: string[];
  documents?: string[];
  sellerType?: string;
  shopName?: string;
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
  deliveryAvailable?: boolean;
  deliveryCharges?: number;
  pickupAvailable?: boolean;
  shippingOptions?: string[];
  reasonForSelling?: string;
  purchasedFrom?: string;
  imeiNumber?: string;
  serialNumber?: string;
  features?: string[];
  additionalInfo?: string;
  returnPolicy?: string;
  refundAvailable?: boolean;
  testingAllowed?: boolean;
  availabilityStatus?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
};

export default function ElectronicsGadgetsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGadget, setEditingGadget] = useState<any>(null);
  const [viewingGadget, setViewingGadget] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(String(s || '').trim());

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const [meta, content] = dataUrl.split(',');
    const match = /data:([^;]+);base64/i.exec(meta || '');
    const mime = match?.[1] || 'application/octet-stream';
    const binary = atob(content || '');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const url = data?.url;
    if (typeof url !== 'string' || url.length === 0) throw new Error('Upload failed: missing url');
    return url;
  };

  const ensureUploadedImageUrls = async (items: string[]): Promise<string[]> => {
    const out: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const v = items[i];
      if (typeof v !== 'string' || v.length === 0) continue;
      if (!isDataMediaUrl(v)) {
        out.push(v);
        continue;
      }
      const file = dataUrlToFile(v, `image-${Date.now()}-${i}.png`);
      const url = await uploadSingleFile(file);
      out.push(url);
    }
    return out;
  };

  const { register, handleSubmit, reset, setValue, watch } = useForm<ElectronicsGadgetFormData>();

  const { data: gadgets = [], isLoading } = useQuery({
    queryKey: ["electronics-gadgets"],
    queryFn: async () => {
      const response = await fetch("/api/admin/electronics-gadgets");
      if (!response.ok) throw new Error("Failed to fetch electronics gadgets");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ElectronicsGadgetFormData) => {
      const response = await fetch("/api/admin/electronics-gadgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create gadget");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electronics-gadgets"] });
      toast({ title: "Success", description: "Electronics gadget created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ElectronicsGadgetFormData }) => {
      const response = await fetch(`/api/admin/electronics-gadgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update gadget");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electronics-gadgets"] });
      toast({ title: "Success", description: "Electronics gadget updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/electronics-gadgets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete gadget");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electronics-gadgets"] });
      toast({ title: "Success", description: "Electronics gadget deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGadget(null);
    reset();
    setImages([]);
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    const accepted: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!allowed.includes(f.type)) { setImageError('Only JPG, PNG, WEBP and GIF allowed'); continue; }
      if (f.size > maxSize) { setImageError('Each image must be <= 5MB'); continue; }
      accepted.push(f);
    }
    if (accepted.length === 0) return;

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

    uploadMultipleFiles(accepted)
      .then((urls) => {
        setImages((prev) => [...prev, ...urls].slice(0, 10));
        setImageError(null);
      })
      .catch((e) => {
        console.error(e);
        setImageError(e instanceof Error ? e.message : 'Failed to upload images');
      });
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); processFiles(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
  const openFileDialog = () => fileInputRef.current?.click();
  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleEdit = (gadget: any) => {
    setEditingGadget(gadget);
    setImages(gadget.images || []);
    Object.keys(gadget).forEach((key) => {
      setValue(key as any, gadget[key]);
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ElectronicsGadgetFormData) => {
    const safeImages = await ensureUploadedImageUrls(images);
    if (safeImages !== images) setImages(safeImages);
    const safeCondition = (data as any)?.condition || editingGadget?.condition || 'good';
    const payload = { ...data, condition: safeCondition, images: safeImages };
    if (editingGadget) {
      updateMutation.mutate({ id: editingGadget.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Electronics & Gadgets</h2>
          <p className="text-muted-foreground">Manage electronics and gadgets listings</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Gadget
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {gadgets.map((gadget: any) => (
            <Card key={gadget.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Smartphone className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{gadget.title}</h3>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{gadget.category}</Badge>
                          <Badge variant="outline">{gadget.brand} {gadget.model}</Badge>
                          <Badge variant="outline">{gadget.condition}</Badge>
                          <Badge variant={gadget.listingType === 'sell' ? 'default' : 'secondary'}>
                            {gadget.listingType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          ₹{Number(gadget.price).toLocaleString()}
                          {gadget.originalPrice && (
                            <span className="line-through ml-2">₹{Number(gadget.originalPrice).toLocaleString()}</span>
                          )}
                        </p>
                        {gadget.city && (
                          <p className="text-sm text-muted-foreground">{gadget.city}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingGadget(gadget)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(gadget)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this gadget?")) {
                          deleteMutation.mutate(gadget.id);
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
            <DialogTitle>{editingGadget ? "Edit" : "Add"} Electronics Gadget</DialogTitle>
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
                    <Select onValueChange={(value) => setValue("listingType", value)} defaultValue={editingGadget?.listingType}>
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

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} rows={3} />
                </div>

                <div>
                  <Label>Images</Label>
                  <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`mt-2 border-2 rounded-md p-4 flex items-center justify-center ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'}`}>
                    <div className="text-center">
                      <p className="mb-2">Drag & drop images here, or <button type="button" onClick={openFileDialog} className="underline">select images</button></p>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => processFiles(e.target.files)} className="hidden" />
                      {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                      {images.length > 0 && (
                        <div className="mt-3 grid grid-cols-5 gap-2">
                          {images.map((src, idx) => (
                            <div key={idx} className="relative">
                              <img src={src} alt={`preview-${idx}`} className="w-24 h-24  rounded" />
                              <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1">✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
                    <Select onValueChange={(value) => setValue("category", value)} defaultValue={editingGadget?.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="smartwatch">Smartwatch</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    <Label htmlFor="condition">Condition *</Label>
                    <Select onValueChange={(value) => setValue("condition", value)} defaultValue={editingGadget?.condition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
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

                  <div className="space-y-2">
                    <Label htmlFor="processor">Processor</Label>
                    <Input id="processor" {...register("processor")} />
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
                    <Input id="price" type="text" {...register("price", { required: true})} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input id="originalPrice" type="number" {...register("originalPrice", { valueAsNumber: true })} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isNegotiable" onCheckedChange={(checked) => setValue("isNegotiable", checked)} />
                    <Label htmlFor="isNegotiable">Negotiable</Label>
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
                    <Switch id="isUrgent" onCheckedChange={(checked) => setValue("isUrgent", checked)} />
                    <Label htmlFor="isUrgent">Urgent Sale</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingGadget ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingGadget && (
        <Dialog open={!!viewingGadget} onOpenChange={() => setViewingGadget(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingGadget.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{viewingGadget.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Brand & Model</p>
                  <p className="text-sm text-muted-foreground">{viewingGadget.brand} {viewingGadget.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-sm text-muted-foreground">{viewingGadget.condition}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">₹{Number(viewingGadget.price).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
