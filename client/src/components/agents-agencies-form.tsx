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
import { Plus, Edit, Trash2, Eye, Building2, X } from "lucide-react";

type AgentAgencyFormData = {
  title: string;
  description?: string;
  agencyType: string;
  agencyName: string;
  ownerName?: string;
  establishedYear?: number;
  licenseNumber?: string;
  specialization?: string;
  services?: string;
  serviceAreas?: string;
  teamSize?: number;
  propertiesHandled?: number;
  verified?: boolean;
  licensed?: boolean;
  freeConsultation?: boolean;
  homeVisit?: boolean;
  onlineService?: boolean;
  emergencyService?: boolean;
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
  socialMediaLinks?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
};


export default function AgentsAgenciesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<AgentAgencyFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["agents-agencies"],
    queryFn: async () => {
      const response = await fetch("/api/admin/agents-agencies");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AgentAgencyFormData) => {
      const response = await fetch("/api/admin/agents-agencies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["agents-agencies"] }); toast({ title: "Success", description: "Service created" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AgentAgencyFormData }) => {
      const response = await fetch(`/api/admin/agents-agencies/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["agents-agencies"] }); toast({ title: "Success", description: "Updated" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/agents-agencies/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["agents-agencies"] }); toast({ title: "Success", description: "Deleted" }); },
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

  const onSubmit = (data: AgentAgencyFormData) => {
    const payload = { ...data, images };
    if (editingService) { updateMutation.mutate({ id: editingService.id, data: payload }); } else { createMutation.mutate(payload); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agents & Agencies</h2>
          <p className="text-muted-foreground">Manage agents and agencies</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Agent/Agency</Button>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Building2 className="h-5 w-5 text-teal-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.agencyName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.agencyType}</Badge>
                          {service.verified && <Badge className="bg-green-600">Verified</Badge>}
                          {service.licensed && <Badge className="bg-blue-600">Licensed</Badge>}
                          {service.freeConsultation && <Badge className="bg-purple-600">Free Consult</Badge>}
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
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Agent/Agency</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
                  <div className="space-y-2">
                    <Label>Agency Type *</Label>
                    <Select onValueChange={(v) => setValue("agencyType", v)} defaultValue={editingService?.agencyType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                        <SelectItem value="property_dealer">Property Dealer</SelectItem>
                        <SelectItem value="insurance_agent">Insurance Agent</SelectItem>
                        <SelectItem value="travel_agent">Travel Agent</SelectItem>
                        <SelectItem value="recruitment_agent">Recruitment Agent</SelectItem>
                        <SelectItem value="immigration_agent">Immigration Agent</SelectItem>
                        <SelectItem value="loan_agent">Loan Agent</SelectItem>
                        <SelectItem value="legal_agent">Legal Agent</SelectItem>
                        <SelectItem value="marketing_agent">Marketing Agent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Agency Name *</Label><Input {...register("agencyName", { required: true })} /></div>
                  <div className="space-y-2"><Label>Owner Name</Label><Input {...register("ownerName")} /></div>
                  <div className="space-y-2"><Label>Established Year</Label><Input type="number" {...register("establishedYear", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>License Number</Label><Input {...register("licenseNumber")} /></div>
                  <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Specialization</Label><Input {...register("specialization")} placeholder="e.g., Residential, Commercial" /></div>
                  <div className="space-y-2"><Label>Services Offered</Label><Input {...register("services")} placeholder="e.g., Buying, Selling, Renting" /></div>
                  <div className="space-y-2"><Label>Service Areas</Label><Input {...register("serviceAreas")} /></div>
                  <div className="space-y-2"><Label>Team Size</Label><Input type="number" {...register("teamSize", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Properties/Deals Handled</Label><Input type="number" {...register("propertiesHandled", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Services & Verification</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="verified" onCheckedChange={(checked) => setValue("verified", checked)} /><Label>Verified</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="licensed" onCheckedChange={(checked) => setValue("licensed", checked)} /><Label>Licensed</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="freeConsultation" onCheckedChange={(checked) => setValue("freeConsultation", checked)} /><Label>Free Consultation</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="homeVisit" onCheckedChange={(checked) => setValue("homeVisit", checked)} /><Label>Home Visit</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="onlineService" onCheckedChange={(checked) => setValue("onlineService", checked)} /><Label>Online Service</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="emergencyService" onCheckedChange={(checked) => setValue("emergencyService", checked)} /><Label>Emergency Service</Label></div>
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
                  <div className="space-y-2"><Label>Social Media Links</Label><Textarea {...register("socialMediaLinks")} placeholder="Facebook, Instagram, LinkedIn" /></div>
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
                  <div className="flex items-center space-x-2"><Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} /><Label>24/7 Available</Label></div>
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

      {viewingService && <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService.title}</DialogTitle></DialogHeader><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Agency</p><p className="text-sm text-muted-foreground">{viewingService.agencyName}</p></div><div><p className="text-sm font-medium">Type</p><p className="text-sm text-muted-foreground">{viewingService.agencyType}</p></div></div></DialogContent></Dialog>}
    </div>
  );
}