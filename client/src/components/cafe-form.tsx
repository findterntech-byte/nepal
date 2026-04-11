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
import { Plus, Edit, Trash2, Eye, Coffee, X } from "lucide-react";

type CafeFormData = {
  title: string;
  description?: string;
  cafeType: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  city: string;
  state?: string;
  fullAddress?: string;
  seatingCapacity?: number;
  outdoorSeating?: boolean;
  rooftop?: boolean;
  acAvailable?: boolean;
  wifiAvailable?: boolean;
  powerOutlets?: boolean;
  quietEnvironment?: boolean;
  petFriendly?: boolean;
  kidsFriendly?: boolean;
  parkingAvailable?: boolean;
  takeaway?: boolean;
  homeDelivery?: boolean;
  dineIn?: boolean;
  coffeeAvailable?: boolean;
  teaAvailable?: boolean;
  snacksAvailable?: boolean;
  bakeryItems?: boolean;
  fastFood?: boolean;
  shakesAndSmoothies?: boolean;
  breakfastAvailable?: boolean;
  allDayBreakfast?: boolean;
  veganOptions?: boolean;
  organicCoffee?: boolean;
  specialtyCoffee?: boolean;
  espresso?: boolean;
  cappuccino?: boolean;
  latte?: boolean;
  coldCoffee?: boolean;
  iceCream?: boolean;
  cakes?: boolean;
  pastries?: boolean;
  cookies?: boolean;
  sandwiches?: boolean;
  pastaAvailable?: boolean;
  pizzaAvailable?: boolean;
  open24Hours?: boolean;
  liveMusic?: boolean;
  boardGames?: boolean;
  workingSpace?: boolean;
  meetingRoom?: boolean;
  eventsSpace?: boolean;
  smokingArea?: boolean;
  alcoholServed?: boolean;
  averageBill?: number;
  openingTime?: string;
  closingTime?: string;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function CafeForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<CafeFormData>();

  const { data: services = [], isLoading } = useQuery({ queryKey: ["cafes"], queryFn: async () => { const res = await fetch("/api/admin/cafes"); if (!res.ok) throw new Error("Failed"); return res.json(); } });

  const createMutation = useMutation({
    mutationFn: async (data: CafeFormData) => { const res = await fetch("/api/admin/cafes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!res.ok) throw new Error("Failed"); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cafes"] }); toast({ title: "Success" }); handleCloseDialog(); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CafeFormData }) => { const res = await fetch(`/api/admin/cafes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!res.ok) throw new Error("Failed"); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cafes"] }); toast({ title: "Success" }); handleCloseDialog(); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const res = await fetch(`/api/admin/cafes/${id}`, { method: "DELETE" }); if (!res.ok) throw new Error("Failed"); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cafes"] }); toast({ title: "Deleted" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const handleEdit = (service: any) => { setEditingService(service); setImages(service.images || []); Object.keys(service).forEach((key) => { if (key !== "id" && key !== "createdAt") setValue(key as any, service[key]); }); setIsDialogOpen(true); };
  const handleView = (service: any) => setViewingService(service);
  const handleDelete = (id: string) => { if (confirm("Delete?")) deleteMutation.mutate(id); };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => { const fd = new FormData(); files.forEach((f) => fd.append("files", f)); const res = await fetch("/api/upload-multiple", { method: "POST", body: fd }); const data = await res.json(); return Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : []; };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; try { const urls = await uploadMultipleFiles(files); setImages((prev) => [...prev, ...urls]); } catch (err) { toast({ title: "Error", description: "Upload failed", variant: "destructive" }); } finally { if (fileInputRef.current) fileInputRef.current.value = ""; } };
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const onSubmit = (data: CafeFormData) => { const payload = { ...data, images }; editingService ? updateMutation.mutate({ id: editingService.id, data: payload }) : createMutation.mutate(payload); };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Cafes</h1><Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (<Card key={service.id}><CardHeader><div className="flex justify-between"><div><CardTitle className="text-lg">{service.title}</CardTitle><p className="text-sm text-muted-foreground">{service.businessName}</p></div>{service.isFeatured && <Badge>Featured</Badge>}</div></CardHeader><CardContent><div className="space-y-2 text-sm"><p><strong>Type:</strong> {service.cafeType}</p><p><strong>City:</strong> {service.city}</p>{service.averageBill && <p><strong>Avg Bill:</strong> ₹{service.averageBill}</p>}</div><div className="flex gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4" /></Button><Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button></div></CardContent></Card>))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Cafe</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Title *</Label><Input {...register("title", { required: true })} placeholder="Cafe Name" /></div>
            <div><Label>Business Name</Label><Input {...register("businessName")} /></div>
            <div><Label>Cafe Type</Label><Select onValueChange={(v) => setValue("cafeType", v)}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="Coffee Shop">Coffee Shop</SelectItem><SelectItem value="Cafe">Cafe</SelectItem><SelectItem value="Tea Lounge">Tea Lounge</SelectItem><SelectItem value="Bakery Cafe">Bakery Cafe</SelectItem><SelectItem value="Dessert Cafe">Dessert Cafe</SelectItem><SelectItem value="Bistro">Bistro</SelectItem></SelectContent></Select></div>
            <div><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
            <div><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
            <div><Label>Email</Label><Input {...register("contactEmail")} /></div>
            <div><Label>Website</Label><Input {...register("website")} /></div>
            <div><Label>City *</Label><Input {...register("city", { required: true })} /></div>
            <div><Label>State</Label><Input {...register("state")} /></div>
            <div><Label>Average Bill (₹)</Label><Input type="number" {...register("averageBill")} /></div>
            <div><Label>Seating Capacity</Label><Input type="number" {...register("seatingCapacity")} /></div>
            <div><Label>Opening Time</Label><Input type="time" {...register("openingTime")} /></div>
            <div><Label>Closing Time</Label><Input type="time" {...register("closingTime")} /></div>
          </div>
          <div className="space-y-3"><Label>Menu Items</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{["coffeeAvailable", "teaAvailable", "snacksAvailable", "bakeryItems", "fastFood", "shakesAndSmoothies", "breakfastAvailable", "allDayBreakfast", "veganOptions", "organicCoffee", "specialtyCoffee", "espresso", "cappuccino", "latte", "coldCoffee", "iceCream", "cakes", "pastries", "cookies", "sandwiches", "pastaAvailable", "pizzaAvailable"].map((item) => (<label key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} /><span className="text-sm">{item.replace(/([A-Z])/g, ' $1')}</span></label>))}</div></div>
          <div className="space-y-3"><Label>Facilities</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{["acAvailable", "wifiAvailable", "powerOutlets", "quietEnvironment", "outdoorSeating", "rooftop", "parkingAvailable", "petFriendly", "kidsFriendly", "takeaway", "homeDelivery", "dineIn", "open24Hours", "liveMusic", "boardGames", "workingSpace", "meetingRoom", "eventsSpace", "smokingArea", "alcoholServed"].map((item) => (<label key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} /><span className="text-sm">{item.replace(/([A-Z])/g, ' $1')}</span></label>))}</div></div>
          <div><Label>Description</Label><Textarea {...register("description")} rows={4} /></div>
          <div><Label>Images</Label><div className="flex flex-wrap gap-2 mt-2">{images.map((img, idx) => (<div key={idx} className="relative"><img src={img} alt="" className="w-24 h-24 object-cover rounded-md" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button></div>))}<label className="cursor-pointer"><input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" /><div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center"><Plus className="h-8 w-8 text-gray-400" /></div></label></div></div>
          <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" {...register("isActive")} defaultChecked={editingService?.isActive ?? true} /><span>Active</span></label><label className="flex items-center gap-2"><input type="checkbox" {...register("isFeatured")} defaultChecked={editingService?.isFeatured ?? false} /><span>Featured</span></label></div>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">{createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}</Button>
        </form>
      </DialogContent></Dialog>
    </div>
  );
}