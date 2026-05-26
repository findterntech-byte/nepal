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
import { Plus, Edit, Trash2, Eye, Building2, X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

type ClinicsHospitalsFormData = {
  title: string;
  description?: string;
  facilityType?: string;
  businessName?: string;
  userId?: string;
  role?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  areaName?: string;
  numberOfBeds?: number;
  numberOfDoctors?: number;
  numberOfNurses?: number;
  emergencyServices?: boolean;
  ambulanceAvailable?: boolean;
  icuAvailable?: boolean;
  nicuAvailable?: boolean;
  operationTheatre?: boolean;
  laboratoryAvailable?: boolean;
  pharmacyAvailable?: boolean;
  bloodBank?: boolean;
  dialysisAvailable?: boolean;
  mriAvailable?: boolean;
  ctScanAvailable?: boolean;
  xrayAvailable?: boolean;
  ultrasoundAvailable?: boolean;
  wifiAvailable?: boolean;
  parkingAvailable?: boolean;
  cafeteriaAvailable?: boolean;
  atmAvailable?: boolean;
  wheelchairAccessible?: boolean;
  airConditioned?: boolean;
  onlineAppointment?: boolean;
  teleconsultation?: boolean;
  homeSampleCollection?: boolean;
  healthCheckupPackages?: boolean;
  insuranceAccepted?: boolean;
  cashlessTreatment?: boolean;
  workingHours?: string;
  languagesKnown?: string;
  certifications?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function ClinicsHospitalsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<ClinicsHospitalsFormData>();

  const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  };

  const userId = user?.id || getStoredUser()?.id;
  const role = user?.role || getStoredUser()?.role;

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["clinics-hospitals", userId || null, role || null],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (userId) query.set('userId', userId);
      if (role) query.set('role', role);
      const url = `/api/admin/clinics-hospitals${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ClinicsHospitalsFormData) => {
      const response = await fetch("/api/admin/clinics-hospitals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clinics-hospitals"] }); toast({ title: "Success", description: "Clinic/Hospital created successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClinicsHospitalsFormData }) => {
      const response = await fetch(`/api/admin/clinics-hospitals/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clinics-hospitals"] }); toast({ title: "Success", description: "Updated successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const response = await fetch(`/api/admin/clinics-hospitals/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Failed"); return response.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clinics-hospitals"] }); toast({ title: "Success", description: "Deleted successfully" }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); setImageError(null); setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleEdit = (service: any) => { setEditingService(service); setImages(service.images || []); Object.keys(service).forEach((key) => { if (key !== "id" && key !== "createdAt" && key !== "updatedAt") setValue(key as any, service[key]); }); setIsDialogOpen(true); };
  const handleView = (service: any) => setViewingService(service);
  const handleDelete = (id: string) => { if (confirm("Delete?")) deleteMutation.mutate(id); };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => { const fd = new FormData(); files.forEach((f) => fd.append("files", f)); const res = await fetch("/api/upload-multiple", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); return Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : []; };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; setUploadingImages(true); setImageError(null); try { const urls = await uploadMultipleFiles(files); setImages((prev) => [...prev, ...urls]); } catch (err: any) { setImageError(err.message); } finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; } };
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const onSubmit = (data: ClinicsHospitalsFormData) => {
    const payload: any = { ...data, images };
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();
    payload.userId = payload.userId || user?.id || stored?.id;
    payload.role = payload.role || user?.role || stored?.role;
    editingService ? updateMutation.mutate({ id: editingService.id, data: payload }) : createMutation.mutate(payload);
  };

  const checkboxes = ["emergencyServices", "ambulanceAvailable", "icuAvailable", "nicuAvailable", "operationTheatre", "laboratoryAvailable", "pharmacyAvailable", "bloodBank", "dialysisAvailable", "mriAvailable", "ctScanAvailable", "xrayAvailable", "ultrasoundAvailable", "wifiAvailable", "parkingAvailable", "cafeteriaAvailable", "atmAvailable", "wheelchairAccessible", "airConditioned", "onlineAppointment", "teleconsultation", "homeSampleCollection", "healthCheckupPackages", "insuranceAccepted", "cashlessTreatment"];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Clinics & Hospitals</h1><Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md">
            <CardHeader><div className="flex justify-between"><div><CardTitle className="text-lg">{service.title}</CardTitle><p className="text-sm text-muted-foreground">{service.businessName}</p></div>{service.isFeatured && <Badge>Featured</Badge>}</div></CardHeader>
            <CardContent><div className="space-y-2 text-sm"><p><strong>Type:</strong> {service.facilityType}</p><p><strong>City:</strong> {service.city}</p>{service.numberOfBeds && <p><strong>Beds:</strong> {service.numberOfBeds}</p>}</div><div className="flex gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4" /></Button><Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button></div></CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? "Edit Clinic/Hospital" : "Add Clinic/Hospital"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
              <div><Label>Business Name</Label><Input {...register("businessName")} /></div>
              <div><Label>Facility Type</Label><Input {...register("facilityType")} placeholder="e.g. Hospital, Clinic" /></div>
              <div><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
              <div><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
              <div><Label>Email</Label><Input {...register("contactEmail")} /></div>
              <div><Label>Website</Label><Input {...register("website")} /></div>
              <div><Label>City *</Label><Input {...register("city", { required: true })} /></div>
              <div><Label>State</Label><Input {...register("state")} /></div>
              <div><Label>Full Address</Label><Input {...register("fullAddress")} /></div>
              <div><Label>Number of Beds</Label><Input type="number" {...register("numberOfBeds", { valueAsNumber: true })} /></div>
              <div><Label>Number of Doctors</Label><Input type="number" {...register("numberOfDoctors", { valueAsNumber: true })} /></div>
              <div><Label>Working Hours</Label><Input {...register("workingHours")} /></div>
              <div><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
              <div><Label>Certifications</Label><Input {...register("certifications")} /></div>
            </div>

            <div className="space-y-2">
              <Label>Facilities</Label>
              <div className="flex flex-wrap gap-2">
                {checkboxes.map((opt) => (
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
          <div className="space-y-2 text-sm">{Object.entries(viewingService || {}).filter(([k]) => !["id", "createdAt", "updatedAt"].includes(k)).map(([k, v]) => <p key={k}><strong>{k}:</strong> {String(v)}</p>)}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}