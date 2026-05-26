import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

type SportsEquipmentFormData = {
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  productType?: string;
  material?: string;
  color?: string;
  size?: string;
  weight?: number;
  price: number;
  mrp?: number;
  discount?: number;
  emiAvailable?: boolean;
  emiStartingFrom?: number;
  condition?: string;
  usageType?: string;
  skillLevel?: string;
  ageGroup?: string;
  gender?: string;
  warrantyAvailable?: boolean;
  warrantyPeriod?: string;
  returnAvailable?: boolean;
  returnDays?: number;
  exchangeAvailable?: boolean;
  sellerId?: string;
  sellerType?: string;
  shopName?: string;
  contactPhone?: string;
  contactEmail?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  fullAddress?: string;
  deliveryAvailable?: boolean;
  deliveryCharges?: number;
  freeDelivery?: boolean;
  sameDayDelivery?: boolean;
  expressDelivery?: boolean;
  codAvailable?: boolean;
  onlinePayment?: boolean;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function SportsEquipmentForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<SportsEquipmentFormData>();

  const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  };
  const activeUserId = user?.id || getStoredUser()?.id;
  const activeRole = user?.role || getStoredUser()?.role;

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["sports-equipment", activeUserId || null, activeRole || null],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (activeUserId) query.set('userId', activeUserId);
      if (activeRole) query.set('role', activeRole);
      const url = `/api/admin/sports-equipment${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SportsEquipmentFormData) => {
      const response = await fetch("/api/admin/sports-equipment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["sports-equipment"] }); toast({ title: "Success", description: "Sports Equipment created successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SportsEquipmentFormData }) => {
      const response = await fetch(`/api/admin/sports-equipment/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["sports-equipment"] }); toast({ title: "Success", description: "Updated successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const response = await fetch(`/api/admin/sports-equipment/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Failed"); return response.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["sports-equipment"] }); toast({ title: "Success", description: "Deleted successfully" }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); setImageError(null); setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleEdit = (service: any) => { setEditingService(service); setImages(service.images || []); Object.keys(service).forEach((key) => { if (key !== "id" && key !== "createdAt" && key !== "updatedAt") setValue(key as any, service[key]); }); setIsDialogOpen(true); };
  const handleView = (service: any) => setViewingService(service);
  const handleDelete = (id: string) => { if (confirm("Delete?")) deleteMutation.mutate(id); };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => { const fd = new FormData(); files.forEach((f) => fd.append("files", f)); const res = await fetch("/api/upload-multiple", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); return Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : []; };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; setUploadingImages(true); setImageError(null); try { const urls = await uploadMultipleFiles(files); setImages((prev) => [...prev, ...urls]); } catch (err: any) { setImageError(err.message); } finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; } };
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const onSubmit = (data: SportsEquipmentFormData) => {
    const payload = { ...data, images };
    const stored = getStoredUser();
    (payload as any).userId = (payload as any).userId || activeUserId || stored?.id;
    (payload as any).role = (payload as any).role || activeRole || stored?.role;
    editingService ? updateMutation.mutate({ id: editingService.id, data: payload }) : createMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Sports Equipment</h1><Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md">
            <CardHeader><div className="flex justify-between"><div><CardTitle className="text-lg">{service.title}</CardTitle><p className="text-sm text-muted-foreground">{service.brand}</p></div>{service.isFeatured && <Badge>Featured</Badge>}</div></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Category:</strong> {service.category}</p>
                <p><strong>Condition:</strong> {service.condition}</p>
                <p><strong>Price:</strong> रू {service.price}</p>
                <p><strong>User ID:</strong> {service.userId || "N/A"}</p>
                <p><strong>Role:</strong> {service.role || "N/A"}</p>
              </div>
              <div className="flex gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4" /></Button><Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? "Edit Sports Equipment" : "Add Sports Equipment"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
              <div><Label>Category *</Label><Input {...register("category", { required: true })} placeholder="e.g. Cricket, Football" /></div>
              <div><Label>Subcategory</Label><Input {...register("subcategory")} /></div>
              <div><Label>Brand</Label><Input {...register("brand")} /></div>
              <div><Label>Model</Label><Input {...register("model")} /></div>
              <div><Label>Product Type</Label><Input {...register("productType")} /></div>
              <div><Label>Material</Label><Input {...register("material")} /></div>
              <div><Label>Color</Label><Input {...register("color")} /></div>
              <div><Label>Size</Label><Input {...register("size")} /></div>
              <div><Label>Weight (kg)</Label><Input type="number" step="0.01" {...register("weight", { valueAsNumber: true })} /></div>
              <div><Label>Price *</Label><Input type="number" {...register("price", { required: true, valueAsNumber: true })} /></div>
              <div><Label>MRP</Label><Input type="number" {...register("mrp", { valueAsNumber: true })} /></div>
              <div><Label>Discount (%)</Label><Input type="number" {...register("discount", { valueAsNumber: true })} /></div>
              <div><Label>Condition</Label><Input {...register("condition")} placeholder="New/Used/Refurbished" /></div>
              <div><Label>Usage Type</Label><Input {...register("usageType")} placeholder="Professional/Amateur" /></div>
              <div><Label>Skill Level</Label><Input {...register("skillLevel")} placeholder="Beginner/Intermediate/Advanced" /></div>
              <div><Label>Age Group</Label><Input {...register("ageGroup")} /></div>
              <div><Label>Gender</Label><Input {...register("gender")} /></div>
              <div><Label>Warranty Period</Label><Input {...register("warrantyPeriod")} /></div>
              <div><Label>Return Days</Label><Input type="number" {...register("returnDays", { valueAsNumber: true })} /></div>
              <div><Label>Shop Name</Label><Input {...register("shopName")} /></div>
              <div><Label>Contact Phone</Label><Input {...register("contactPhone")} /></div>
              <div><Label>Contact Email</Label><Input {...register("contactEmail")} /></div>
              <div><Label>City</Label><Input {...register("city")} /></div>
              <div><Label>State</Label><Input {...register("stateProvince")} /></div>
              <div><Label>Full Address</Label><Input {...register("fullAddress")} /></div>
              <div><Label>Delivery Charges</Label><Input type="number" {...register("deliveryCharges", { valueAsNumber: true })} /></div>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex flex-wrap gap-2">
                {["emiAvailable", "warrantyAvailable", "returnAvailable", "exchangeAvailable", "freeDelivery", "sameDayDelivery", "expressDelivery", "codAvailable", "onlinePayment"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" {...register(opt as any)} className="rounded" />
                    {opt.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()).trim()}
                  </label>
                ))}
              </div>
            </div>

            <div><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
            <div><Label>Images</Label><input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="w-full" /></div>
            {images.length > 0 && <div className="flex gap-2 flex-wrap">{images.map((img, idx) => <div key={idx} className="relative"><img src={img} alt="" className="w-20 h-20 object-cover rounded" /><button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button></div>)}</div>}
            {uploadingImages && <p>Uploading...</p>}
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editingService ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService?.title}</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            {Object.entries(viewingService || {}).filter(([k]) => !["id", "createdAt", "updatedAt"].includes(k)).map(([k, v]) => <p key={k}><strong>{k}:</strong> {String(v)}</p>)}
            <p><strong>User ID:</strong> {viewingService?.userId || "N/A"}</p>
            <p><strong>Role:</strong> {viewingService?.role || "N/A"}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}