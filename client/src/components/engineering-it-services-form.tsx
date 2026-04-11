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
import { Plus, Edit, Trash2, Eye, Code, X } from "lucide-react";

type EngineeringITFormData = {
  title: string;
  description?: string;
  serviceCategory: string;
  businessName: string;
  teamSize?: number;
  foundedYear?: number;
  specialization?: string;
  technologies?: string;
  certifications?: string;
  serviceAreas?: string;
  hourlyRate?: number;
  projectBasedPricing?: boolean;
  freeConsultation?: boolean;
  remoteService?: boolean;
  onsiteService?: boolean;
  emergencySupport?: boolean;
  isoCertified?: boolean;
  msmeRegistered?: boolean;
  governmentContractor?: boolean;
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


export default function EngineeringITServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<EngineeringITFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["engineering-it-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/engineering-it-services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EngineeringITFormData) => {
      const response = await fetch("/api/admin/engineering-it-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed to create"); }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engineering-it-services"] });
      toast({ title: "Success", description: "Engineering/IT service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EngineeringITFormData }) => {
      const response = await fetch(`/api/admin/engineering-it-services/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed to update"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["engineering-it-services"] }); toast({ title: "Success", description: "Service updated" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/engineering-it-services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["engineering-it-services"] }); toast({ title: "Success", description: "Deleted" }); },
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
      if (!res.ok) throw new Error((json as any)?.message || "Failed to upload");
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

  const onSubmit = (data: EngineeringITFormData) => {
    const payload = { ...data, images };
    if (editingService) { updateMutation.mutate({ id: editingService.id, data: payload }); } else { createMutation.mutate(payload); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Engineering & IT Services</h2>
          <p className="text-muted-foreground">Manage engineering and IT service providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Code className="h-5 w-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.businessName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.serviceCategory}</Badge>
                          {service.isoCertified && <Badge className="bg-green-600">ISO</Badge>}
                          {service.msmeRegistered && <Badge className="bg-blue-600">MSME</Badge>}
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
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Engineering/IT Service</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select onValueChange={(v) => setValue("serviceCategory", v)} defaultValue={editingService?.serviceCategory}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software_development">Software Development</SelectItem>
                        <SelectItem value="web_development">Web Development</SelectItem>
                        <SelectItem value="mobile_development">Mobile Development</SelectItem>
                        <SelectItem value="ui_ux_design">UI/UX Design</SelectItem>
                        <SelectItem value="cloud_services">Cloud Services</SelectItem>
                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="data_analytics">Data Analytics</SelectItem>
                        <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                        <SelectItem value="iot">IoT Solutions</SelectItem>
                        <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                        <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="electrical_engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="consulting">IT Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Business Name *</Label><Input {...register("businessName", { required: true })} /></div>
                  <div className="space-y-2"><Label>Team Size</Label><Input type="number" {...register("teamSize", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Founded Year</Label><Input type="number" {...register("foundedYear", { valueAsNumber: true })} /></div>
                  <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Technical Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Specialization</Label><Input {...register("specialization")} placeholder="e.g., ERP, CRM, Web Apps" /></div>
                  <div className="space-y-2"><Label>Technologies</Label><Input {...register("technologies")} placeholder="e.g., React, Python, AWS" /></div>
                  <div className="space-y-2"><Label>Certifications</Label><Input {...register("certifications")} placeholder="e.g., ISO 27001" /></div>
                  <div className="space-y-2"><Label>Service Areas</Label><Input {...register("serviceAreas")} /></div>
                  <div className="space-y-2"><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Pricing & Services</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Hourly Rate (₹)</Label><Input type="number" {...register("hourlyRate", { valueAsNumber: true })} /></div>
                  <div className="flex items-center space-x-2"><Switch id="projectBasedPricing" onCheckedChange={(checked) => setValue("projectBasedPricing", checked)} /><Label>Project Based Pricing</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="freeConsultation" onCheckedChange={(checked) => setValue("freeConsultation", checked)} /><Label>Free Consultation</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="remoteService" onCheckedChange={(checked) => setValue("remoteService", checked)} /><Label>Remote Service</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="onsiteService" onCheckedChange={(checked) => setValue("onsiteService", checked)} /><Label>Onsite Service</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="emergencySupport" onCheckedChange={(checked) => setValue("emergencySupport", checked)} /><Label>Emergency Support</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="isoCertified" onCheckedChange={(checked) => setValue("isoCertified", checked)} /><Label>ISO Certified</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="msmeRegistered" onCheckedChange={(checked) => setValue("msmeRegistered", checked)} /><Label>MSME Registered</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="governmentContractor" onCheckedChange={(checked) => setValue("governmentContractor", checked)} /><Label>Government Contractor</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
                  <div className="space-y-2"><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("contactEmail")} /></div>
                  <div className="space-y-2"><Label>Website</Label><Input {...register("website")} placeholder="https://" /></div>
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
                  <div className="flex items-center space-x-2"><Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} /><Label>24/7 Support</Label></div>
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

      {viewingService && <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService.title}</DialogTitle></DialogHeader><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Business</p><p className="text-sm text-muted-foreground">{viewingService.businessName}</p></div><div><p className="text-sm font-medium">Category</p><p className="text-sm text-muted-foreground">{viewingService.serviceCategory}</p></div></div></DialogContent></Dialog>}
    </div>
  );
}