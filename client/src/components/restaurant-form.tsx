import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Utensils, X } from "lucide-react";

type RestaurantFormData = {
  title: string;
  description?: string;
  restaurantType: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  cuisineType?: string[];
  vegOnly?: boolean;
  nonVegOnly?: boolean;
  bothVegNonVeg?: boolean;
  seatingCapacity?: number;
  outdoorSeating?: boolean;
  rooftop?: boolean;
  acAvailable?: boolean;
  nonAc?: boolean;
  homeDelivery?: boolean;
  takeaway?: boolean;
  dineIn?: boolean;
  onlineOrdering?: boolean;
  tableBooking?: boolean;
  reservationRequired?: boolean;
  alcoholServed?: boolean;
  barAvailable?: boolean;
  wifiAvailable?: boolean;
  parkingAvailable?: boolean;
  valetParking?: boolean;
  wheelchairAccessible?: boolean;
  petFriendly?: boolean;
  kidsFriendly?: boolean;
  liveMusic?: boolean;
  liveCooking?: boolean;
  danceFloor?: boolean;
  karaoke?: boolean;
  smokingArea?: boolean;
  open24Hours?: boolean;
  breakfastAvailable?: boolean;
  lunchAvailable?: boolean;
  dinnerAvailable?: boolean;
  midnightSnacks?: boolean;
  buffetAvailable?: boolean;
  alaCarte?: boolean;
  familyPack?: boolean;
  birthdayParty?: boolean;
  corporateEvents?: boolean;
  dateNight?: boolean;
  happyHour?: boolean;
  openingTime?: string;
  closingTime?: string;
  pricePerPerson?: number;
  averageCost?: number;
  minOrderValue?: number;
  deliveryCharges?: number;
  freeDeliveryAbove?: number;
  discounts?: string;
  rating?: number;
  cuisine?: string;
  specialties?: string;
  paymentMethods?: string;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function RestaurantForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<RestaurantFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => { const response = await fetch("/api/admin/restaurants"); if (!response.ok) throw new Error("Failed"); return response.json(); },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RestaurantFormData) => {
      const response = await fetch("/api/admin/restaurants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["restaurants"] }); toast({ title: "Success", description: "Restaurant created successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RestaurantFormData }) => {
      const response = await fetch(`/api/admin/restaurants/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["restaurants"] }); toast({ title: "Success", description: "Updated successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const response = await fetch(`/api/admin/restaurants/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Failed"); return response.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["restaurants"] }); toast({ title: "Success", description: "Deleted successfully" }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); setImageError(null); setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleEdit = (service: any) => { setEditingService(service); setImages(service.images || []); Object.keys(service).forEach((key) => { if (key !== "id" && key !== "createdAt" && key !== "updatedAt") setValue(key as any, service[key]); }); setIsDialogOpen(true); };
  const handleView = (service: any) => setViewingService(service);
  const handleDelete = (id: string) => { if (confirm("Delete?")) deleteMutation.mutate(id); };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => { const fd = new FormData(); files.forEach((f) => fd.append("files", f)); const res = await fetch("/api/upload-multiple", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); return Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : []; };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; setUploadingImages(true); setImageError(null); try { const urls = await uploadMultipleFiles(files); setImages((prev) => [...prev, ...urls]); } catch (err: any) { setImageError(err.message); } finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; } };
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const onSubmit = (data: RestaurantFormData) => { const payload = { ...data, images }; editingService ? updateMutation.mutate({ id: editingService.id, data: payload }) : createMutation.mutate(payload); };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Restaurants</h1><Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md">
            <CardHeader><div className="flex justify-between"><div><CardTitle className="text-lg">{service.title}</CardTitle><p className="text-sm text-muted-foreground">{service.businessName}</p></div>{service.isFeatured && <Badge>Featured</Badge>}</div></CardHeader>
            <CardContent><div className="space-y-2 text-sm"><p><strong>Type:</strong> {service.restaurantType}</p><p><strong>City:</strong> {service.city}</p>{service.averageCost && <p><strong>Avg Cost:</strong> ₹{service.averageCost}</p>}</div><div className="flex gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4" /></Button><Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button></div></CardContent>
          </Card>))}
      </div>
      {services.length === 0 && !isLoading && <div className="text-center py-12">No restaurants found</div>}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Restaurant</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Title *</Label><Input {...register("title", { required: true })} placeholder="Restaurant Name" /></div>
            <div><Label>Business Name</Label><Input {...register("businessName")} placeholder="Company Name" /></div>
            <div><Label>Restaurant Type</Label><Select onValueChange={(v) => setValue("restaurantType", v)}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="Fine Dining">Fine Dining</SelectItem><SelectItem value="Casual Dining">Casual Dining</SelectItem><SelectItem value="Fast Food">Fast Food</SelectItem><SelectItem value="Cafe">Cafe</SelectItem><SelectItem value="Bistro">Bistro</SelectItem><SelectItem value="Dhabha">Dhabha</SelectItem><SelectItem value="Food Court">Food Court</SelectItem><SelectItem value="Bakery">Bakery</SelectItem></SelectContent></Select></div>
            <div><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
            <div><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
            <div><Label>Email</Label><Input {...register("contactEmail")} /></div>
            <div><Label>Website</Label><Input {...register("website")} /></div>
            <div><Label>City *</Label><Input {...register("city", { required: true })} /></div>
            <div><Label>State</Label><Input {...register("state")} /></div>
            <div><Label>Full Address</Label><Input {...register("fullAddress")} /></div>
            <div><Label>Average Cost (₹)</Label><Input type="number" {...register("averageCost")} /></div>
            <div><Label>Seating Capacity</Label><Input type="number" {...register("seatingCapacity")} /></div>
            <div><Label>Opening Time</Label><Input type="time" {...register("openingTime")} /></div>
            <div><Label>Closing Time</Label><Input type="time" {...register("closingTime")} /></div>
          </div>
          <div className="space-y-3"><Label>Food Type</Label><div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" {...register("vegOnly")} /><span>Veg Only</span></label><label className="flex items-center gap-2"><input type="checkbox" {...register("nonVegOnly")} /><span>Non-Veg Only</span></label><label className="flex items-center gap-2"><input type="checkbox" {...register("bothVegNonVeg")} /><span>Both</span></label></div></div>
          <div className="space-y-3"><Label>Services</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{["homeDelivery", "takeaway", "dineIn", "onlineOrdering", "tableBooking", "acAvailable", "wifiAvailable", "parkingAvailable", "valetParking", "outdoorSeating", "rooftop", "kidsFriendly", "petFriendly", "open24Hours", "breakfastAvailable", "lunchAvailable", "dinnerAvailable", "buffetAvailable", "alaCarte", "happyHour"].map((item) => (<label key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} /><span className="text-sm">{item.replace(/([A-Z])/g, ' $1')}</span></label>))}</div></div>
          <div><Label>Description</Label><Textarea {...register("description")} rows={4} /></div>
          <div><Label>Images</Label><div className="flex flex-wrap gap-2 mt-2">{images.map((img, idx) => (<div key={idx} className="relative"><img src={img} alt="" className="w-24 h-24 object-cover rounded-md" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button></div>))}<label className="cursor-pointer"><input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" /><div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center"><Plus className="h-8 w-8 text-gray-400" /></div></label></div>{uploadingImages && <p>Uploading...</p>}</div>
          <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" {...register("isActive")} defaultChecked={editingService?.isActive ?? true} /><span>Active</span></label><label className="flex items-center gap-2"><input type="checkbox" {...register("isFeatured")} defaultChecked={editingService?.isFeatured ?? false} /><span>Featured</span></label></div>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">{createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}</Button>
        </form>
      </DialogContent></Dialog>
      <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}><DialogContent><DialogHeader><DialogTitle>{viewingService?.title}</DialogTitle></DialogHeader><div className="space-y-4">{viewingService?.description && <p>{viewingService.description}</p>}</div></DialogContent></Dialog>
    </div>
  );
}