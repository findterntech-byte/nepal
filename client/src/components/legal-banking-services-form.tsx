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
import { Plus, Edit, Trash2, Eye, Scale, X } from "lucide-react";

type LegalBankingFormData = {
  title: string;
  description?: string;
  serviceCategory: string;
  businessName: string;
  firmName?: string;
  establishedYear?: number;
  specialization?: string;
  licenseNumber?: string;
  barCouncilNumber?: string;
  serviceAreas?: string;
  consultationFee?: number;
  freeConsultation?: boolean;
  onlineConsultation?: boolean;
  homeVisit?: boolean;
  courtRepresentation?: boolean;
  documentDrafting?: boolean;
  notarized?: boolean;
  registered?: boolean;
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


export default function LegalBankingServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<LegalBankingFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["legal-banking-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/legal-banking-services");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: LegalBankingFormData) => {
      const response = await fetch("/api/admin/legal-banking-services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["legal-banking-services"] }); toast({ title: "Success", description: "Service created" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LegalBankingFormData }) => {
      const response = await fetch(`/api/admin/legal-banking-services/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["legal-banking-services"] }); toast({ title: "Success", description: "Updated" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/legal-banking-services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["legal-banking-services"] }); toast({ title: "Success", description: "Deleted" }); },
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

  const onSubmit = (data: LegalBankingFormData) => {
    const payload = { ...data, images };
    if (editingService) { updateMutation.mutate({ id: editingService.id, data: payload }); } else { createMutation.mutate(payload); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Legal, Banking, Loan & Land Surveying Services</h2>
          <p className="text-muted-foreground">Manage legal, banking, and land survey services</p>
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
                      <Scale className="h-5 w-5 text-indigo-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.businessName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.serviceCategory}</Badge>
                          {service.registered && <Badge className="bg-green-600">Registered</Badge>}
                          {service.notarized && <Badge className="bg-blue-600">Notarized</Badge>}
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
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Legal/Banking Service</DialogTitle></DialogHeader>
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
                        <SelectItem value="legal_services">Legal Services</SelectItem>
                        <SelectItem value="lawyer">Lawyer/Advocate</SelectItem>
                        <SelectItem value="notary">Notary Public</SelectItem>
                        <SelectItem value="banking_services">Banking Services</SelectItem>
                        <SelectItem value="loan_services">Loan Services</SelectItem>
                        <SelectItem value="financial_advisory">Financial Advisory</SelectItem>
                        <SelectItem value="land_surveying">Land Surveying</SelectItem>
                        <SelectItem value="property_verification">Property Verification</SelectItem>
                        <SelectItem value="title_search">Title Search</SelectItem>
                        <SelectItem value="court_filing">Court Filing Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Business Name *</Label><Input {...register("businessName", { required: true })} /></div>
                  <div className="space-y-2"><Label>Firm Name</Label><Input {...register("firmName")} /></div>
                  <div className="space-y-2"><Label>Established Year</Label><Input type="number" {...register("establishedYear", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>License Number</Label><Input {...register("licenseNumber")} /></div>
                  <div className="space-y-2"><Label>Bar Council Number</Label><Input {...register("barCouncilNumber")} /></div>
                  <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Specialization</Label><Input {...register("specialization")} placeholder="e.g., Criminal Law, Property Law" /></div>
                  <div className="space-y-2"><Label>Service Areas</Label><Input {...register("serviceAreas")} /></div>
                  <div className="space-y-2"><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
                  <div className="space-y-2"><Label>Consultation Fee (₹)</Label><Input type="number" {...register("consultationFee", { valueAsNumber: true })} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Services Offered</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="freeConsultation" onCheckedChange={(checked) => setValue("freeConsultation", checked)} /><Label>Free Consultation</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="onlineConsultation" onCheckedChange={(checked) => setValue("onlineConsultation", checked)} /><Label>Online Consultation</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="homeVisit" onCheckedChange={(checked) => setValue("homeVisit", checked)} /><Label>Home Visit</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="courtRepresentation" onCheckedChange={(checked) => setValue("courtRepresentation", checked)} /><Label>Court Representation</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="documentDrafting" onCheckedChange={(checked) => setValue("documentDrafting", checked)} /><Label>Document Drafting</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="notarized" onCheckedChange={(checked) => setValue("notarized", checked)} /><Label>Notarized Documents</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="registered" onCheckedChange={(checked) => setValue("registered", checked)} /><Label>Registered Documents</Label></div>
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

      {viewingService && <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService.title}</DialogTitle></DialogHeader><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Business</p><p className="text-sm text-muted-foreground">{viewingService.businessName}</p></div><div><p className="text-sm font-medium">Category</p><p className="text-sm text-muted-foreground">{viewingService.serviceCategory}</p></div></div></DialogContent></Dialog>}
    </div>
  );
}