import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Users, X } from "lucide-react";

type LaborWorkerFormData = {
  title: string;
  description?: string;
  workerType: string;
  businessName: string;
  workerName: string;
  skills?: string;
  experience?: string;
  age?: number;
  gender?: string;
  availability?: string;
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  freeDemo?: boolean;
  pickupAvailable?: boolean;
  onsiteAvailable?: boolean;
  certified?: boolean;
  backgroundVerified?: boolean;
  toolsProvided?: boolean;
  transportAvailable?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  city?: string;
  fullAddress: string;
  workingHours?: string;
  available24_7?: boolean;
  languageKnown?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
};


export default function LaborWorkerServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<LaborWorkerFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["labor-worker-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/labor-worker-services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: LaborWorkerFormData) => {
      const response = await fetch("/api/admin/labor-worker-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor-worker-services"] });
      toast({ title: "Success", description: "Labor/Worker service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LaborWorkerFormData }) => {
      const response = await fetch(`/api/admin/labor-worker-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor-worker-services"] });
      toast({ title: "Success", description: "Labor/Worker service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/labor-worker-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor-worker-services"] });
      toast({ title: "Success", description: "Labor/Worker service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    reset();
    setImages([]);
    setImageError(null);
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setImages(service.images || []);
    setImageError(null);
    Object.keys(service).forEach((key) => {
      setValue(key as any, service[key]);
    });
    setIsDialogOpen(true);
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
      const res = await fetch("/api/admin/upload-multiple", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as any)?.message || "Failed to upload images");
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
      if (err) { setImageError(err); if (fileInputRef.current) fileInputRef.current.value = ""; return; }
    }
    try { await uploadImageFiles(picked); } catch (e: any) { setImageError(e?.message || "Failed to upload images"); }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: LaborWorkerFormData) => {
    const payload: LaborWorkerFormData = { ...data, images };
    if (editingService) { updateMutation.mutate({ id: editingService.id, data: payload }); } 
    else { createMutation.mutate(payload); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Labor & Worker Services</h2>
          <p className="text-muted-foreground">Manage labor and worker service providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Worker Service
        </Button>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Users className="h-5 w-5 text-orange-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.businessName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.workerType}</Badge>
                          {service.certified && <Badge className="bg-green-600">Certified</Badge>}
                          {service.backgroundVerified && <Badge className="bg-blue-600">Verified</Badge>}
                          {service.available24_7 && <Badge className="bg-orange-600">24/7</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {service.workerName} {service.experience && `• ${service.experience}`}
                        </p>
                        {service.city && <p className="text-sm text-muted-foreground">{service.city}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingService(service)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(service.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Worker Service</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
                  <div className="space-y-2">
                    <Label>Worker Type *</Label>
                    <Select onValueChange={(v) => setValue("workerType", v)} defaultValue={editingService?.workerType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumber">Plumber</SelectItem>
                        <SelectItem value="electrician">Electrician</SelectItem>
                        <SelectItem value="carpenter">Carpenter</SelectItem>
                        <SelectItem value="painter">Painter</SelectItem>
                        <SelectItem value="mason">Mason</SelectItem>
                        <SelectItem value="welder">Welder</SelectItem>
                        <SelectItem value="mechanic">Mechanic</SelectItem>
                        <SelectItem value="construction_worker">Construction Worker</SelectItem>
                        <SelectItem value="factory_worker">Factory Worker</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="security_guard">Security Guard</SelectItem>
                        <SelectItem value="household_helper">Household Helper</SelectItem>
                        <SelectItem value="delivery_worker">Delivery Worker</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Business/Agency Name</Label><Input {...register("businessName")} /></div>
                  <div className="space-y-2"><Label>Worker Name *</Label><Input {...register("workerName", { required: true })} /></div>
                  <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Worker Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Skills</Label><Input {...register("skills")} placeholder="e.g., Plumbing, Pipe Fitting" /></div>
                  <div className="space-y-2"><Label>Experience</Label><Input {...register("experience")} placeholder="e.g., 5 years" /></div>
                  <div className="space-y-2"><Label>Age</Label><Input type="number" {...register("age", { valueAsNumber: true })} /></div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(v) => setValue("gender", v)} defaultValue={editingService?.gender}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Language Known</Label><Input {...register("languageKnown")} /></div>
                  <div className="space-y-2"><Label>Availability</Label><Input {...register("availability")} placeholder="e.g., Full Time, Part Time" /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Hourly Rate (₹)</Label><Input type="number" {...register("hourlyRate", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Daily Rate (₹)</Label><Input type="number" {...register("dailyRate", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Monthly Rate (₹)</Label><Input type="number" {...register("monthlyRate", { valueAsNumber: true })} /></div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="freeDemo" onCheckedChange={(checked) => setValue("freeDemo", checked)} />
                  <Label htmlFor="freeDemo">Free Demo</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Services</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="pickupAvailable" onCheckedChange={(checked) => setValue("pickupAvailable", checked)} /><Label>Pickup Available</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="onsiteAvailable" onCheckedChange={(checked) => setValue("onsiteAvailable", checked)} /><Label>Onsite Service</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="certified" onCheckedChange={(checked) => setValue("certified", checked)} /><Label>Certified</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="backgroundVerified" onCheckedChange={(checked) => setValue("backgroundVerified", checked)} /><Label>Background Verified</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="toolsProvided" onCheckedChange={(checked) => setValue("toolsProvided", checked)} /><Label>Tools Provided</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="transportAvailable" onCheckedChange={(checked) => setValue("transportAvailable", checked)} /><Label>Transport Available</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
                  <div className="space-y-2"><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("contactEmail")} /></div>
                  <div className="flex items-center space-x-2"><Switch id="whatsappAvailable" onCheckedChange={(checked) => setValue("whatsappAvailable", checked)} /><Label>WhatsApp</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>City</Label><Input {...register("city")} /></div>
                  <div className="space-y-2"><Label>Working Hours</Label><Input {...register("workingHours")} /></div>
                  <div className="col-span-2 space-y-2"><Label>Full Address *</Label><Input {...register("fullAddress", { required: true })} /></div>
                  <div className="flex items-center space-x-2"><Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} /><Label>Available 24/7</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Images</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2 flex-1"><Label>Upload Images (max 10)</Label><Input type="file" accept="image/*" multiple ref={fileInputRef} disabled={uploadingImages} onChange={(e) => processFiles(e.target.files)} /></div>
                    <div className="text-sm text-muted-foreground">{images.length}/10</div>
                  </div>
                  {uploadingImages && <div>Uploading...</div>}
                  {imageError && <div className="text-red-600">{imageError}</div>}
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {images.map((url, idx) => (<div key={idx} className="relative"><img src={url} alt={`img ${idx+1}`} className="h-20 w-full rounded-md border object-cover" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 bg-white/80" onClick={() => removeImage(idx)}><X className="h-4 w-4" /></Button></div>))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} /><Label>Active</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} /><Label>Featured</Label></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {viewingService && (
        <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{viewingService.title}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm font-medium">Worker Name</p><p className="text-sm text-muted-foreground">{viewingService.workerName}</p></div>
                <div><p className="text-sm font-medium">Worker Type</p><p className="text-sm text-muted-foreground">{viewingService.workerType}</p></div>
                <div><p className="text-sm font-medium">Contact</p><p className="text-sm text-muted-foreground">{viewingService.contactPhone}</p></div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}