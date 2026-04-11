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
import { Plus, Edit, Trash2, Eye, Heart, X } from "lucide-react";

type NGOServiceFormData = {
  title: string;
  description?: string;
  ngoType: string;
  organizationName: string;
  registrationNumber?: string;
  foundedYear?: number;
  mission?: string;
  vision?: string;
  focusAreas?: string;
  targetBeneficiaries?: string;
  servicesOffered?: string;
  volunteerOpportunities?: boolean;
  donationAccepted?: boolean;
  ngoAccredited?: boolean;
  governmentRecognized?: boolean;
  onlineServices?: boolean;
  freeServices?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  website?: string;
  whatsappAvailable?: boolean;
  city?: string;
  fullAddress: string;
  workingHours?: string;
  available24_7?: boolean;
  languagesKnown?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
};


export default function NGOSocialServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<NGOServiceFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["ngo-social-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ngo-social-services");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NGOServiceFormData) => {
      const response = await fetch("/api/admin/ngo-social-services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["ngo-social-services"] }); toast({ title: "Success", description: "Service created" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: NGOServiceFormData }) => {
      const response = await fetch(`/api/admin/ngo-social-services/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["ngo-social-services"] }); toast({ title: "Success", description: "Updated" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/ngo-social-services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["ngo-social-services"] }); toast({ title: "Success", description: "Deleted" }); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); setImageError(null); setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const handleEdit = (service: any) => { setEditingService(service); setImages(service.images || []); Object.keys(service).forEach((key) => { setValue(key as any, service[key]); }); setIsDialogOpen(true); };

  const validateImageFile = (file: File) => { const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]; const maxSize = 5 * 1024 * 1024; if (!allowed.includes(file.type)) return "Only JPG, PNG, WEBP, GIF"; if (file.size > maxSize) return "Max 5MB"; return null; };

  const uploadImageFiles = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const formData = new FormData(); files.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/admin/upload-multiple", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as any)?.message || "Failed");
      const urls: string[] = Array.isArray((json as any)?.files) ? (json as any).files.map((f: any) => f?.url).filter((u: any) => typeof u === "string") : [];
      if (urls.length === 0) throw new Error("Failed");
      setImages((prev) => [...prev, ...urls].slice(0, 10)); setImageError(null);
    } finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return; setImageError(null);
    const remaining = 10 - images.length; if (remaining <= 0) { setImageError("Max 10"); if (fileInputRef.current) fileInputRef.current.value = ""; return; }
    const picked = Array.from(files).slice(0, remaining);
    for (const f of picked) { const err = validateImageFile(f); if (err) { setImageError(err); if (fileInputRef.current) fileInputRef.current.value = ""; return; } }
    try { await uploadImageFiles(picked); } catch (e: any) { setImageError(e?.message || "Upload failed"); }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: NGOServiceFormData) => {
    const payload = { ...data, images };
    if (editingService) { updateMutation.mutate({ id: editingService.id, data: payload }); } else { createMutation.mutate(payload); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">NGOs & Social Services</h2>
          <p className="text-muted-foreground">Manage NGOs and social service organizations</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add NGO/Social Service</Button>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Heart className="h-5 w-5 text-red-500 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.organizationName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.ngoType}</Badge>
                          {service.ngoAccredited && <Badge className="bg-green-600">Accredited</Badge>}
                          {service.governmentRecognized && <Badge className="bg-blue-600">Gov Recognized</Badge>}
                          {service.donationAccepted && <Badge className="bg-purple-600">Donations</Badge>}
                        </div>
                        {service.city && <p className="text-sm text-muted-foreground mt-2">{service.city}</p>}
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
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} NGO/Social Service</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
                  <div className="space-y-2">
                    <Label>NGO Type *</Label>
                    <Select onValueChange={(v) => setValue("ngoType", v)} defaultValue={editingService?.ngoType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charitable">Charitable Organization</SelectItem>
                        <SelectItem value="welfare">Welfare Association</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="social_service">Social Service Agency</SelectItem>
                        <SelectItem value="community">Community Organization</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                        <SelectItem value="religious">Religious/Charitable</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Organization Name *</Label><Input {...register("organizationName", { required: true })} /></div>
                  <div className="space-y-2"><Label>Registration Number</Label><Input {...register("registrationNumber")} /></div>
                  <div className="space-y-2"><Label>Founded Year</Label><Input type="number" {...register("foundedYear", { valueAsNumber: true })} /></div>
                  <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Mission & Focus</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Mission</Label><Textarea {...register("mission")} placeholder="Organization mission" /></div>
                  <div className="space-y-2"><Label>Vision</Label><Textarea {...register("vision")} placeholder="Organization vision" /></div>
                  <div className="space-y-2"><Label>Focus Areas</Label><Input {...register("focusAreas")} placeholder="e.g., Education, Healthcare, Environment" /></div>
                  <div className="space-y-2"><Label>Target Beneficiaries</Label><Input {...register("targetBeneficiaries")} placeholder="e.g., Women, Children, Elderly" /></div>
                  <div className="space-y-2"><Label>Services Offered</Label><Input {...register("servicesOffered")} placeholder="e.g., Counseling, Aid Distribution" /></div>
                  <div className="space-y-2"><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Services & Recognition</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="volunteerOpportunities" onCheckedChange={(checked) => setValue("volunteerOpportunities", checked)} /><Label>Volunteer Opportunities</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="donationAccepted" onCheckedChange={(checked) => setValue("donationAccepted", checked)} /><Label>Donations Accepted</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="ngoAccredited" onCheckedChange={(checked) => setValue("ngoAccredited", checked)} /><Label>Accredited</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="governmentRecognized" onCheckedChange={(checked) => setValue("governmentRecognized", checked)} /><Label>Government Recognized</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="onlineServices" onCheckedChange={(checked) => setValue("onlineServices", checked)} /><Label>Online Services</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="freeServices" onCheckedChange={(checked) => setValue("freeServices", checked)} /><Label>Free Services</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
                  <div className="space-y-2"><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("contactEmail")} /></div>
                  <div className="space-y-2"><Label>Website</Label><Input {...register("website")} /></div>
                  <div className="flex items-center space-x-2"><Switch id="whatsappAvailable" onCheckedChange={(checked) => setValue("whatsappAvailable", checked)} /><Label>WhatsApp</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>City</Label><Input {...register("city")} /></div>
                  <div className="space-y-2"><Label>Working Hours</Label><Input {...register("workingHours")} /></div>
                  <div className="col-span-2 space-y-2"><Label>Full Address *</Label><Input {...register("fullAddress", { required: true })} /></div>
                  <div className="flex items-center space-x-2"><Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} /><Label>24/7 Emergency</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Images</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2 flex-1"><Label>Upload Images</Label><Input type="file" accept="image/*" multiple ref={fileInputRef} disabled={uploadingImages} onChange={(e) => processFiles(e.target.files)} /></div>
                    <div className="text-sm text-muted-foreground">{images.length}/10</div>
                  </div>
                  {imageError && <div className="text-red-600">{imageError}</div>}
                </div>
                {images.length > 0 && <div className="grid grid-cols-5 gap-3">{images.map((url, idx) => (<div key={idx} className="relative"><img src={url} alt="" className="h-20 w-full rounded-md border object-cover" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => removeImage(idx)}><X className="h-4 w-4" /></Button></div>))}</div>}
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} /><Label>Active</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} /><Label>Featured</Label></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {viewingService && <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService.title}</DialogTitle></DialogHeader><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Organization</p><p className="text-sm text-muted-foreground">{viewingService.organizationName}</p></div><div><p className="text-sm font-medium">Type</p><p className="text-sm text-muted-foreground">{viewingService.ngoType}</p></div></div></DialogContent></Dialog>}
    </div>
  );
}