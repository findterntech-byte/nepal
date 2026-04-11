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
import { Plus, Edit, Trash2, Eye, TrendingUp, X } from "lucide-react";

type SalesMarketingFormData = {
  title: string;
  description?: string;
  serviceCategory: string;
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
  services?: string[];
  digitalMarketing?: boolean;
  seoServices?: boolean;
  socialMediaMarketing?: boolean;
  contentMarketing?: boolean;
  emailMarketing?: boolean;
  ppcAdvertising?: boolean;
  brandMarketing?: boolean;
  offlineMarketing?: boolean;
  televisionAds?: boolean;
  radioAds?: boolean;
  newspaperAds?: boolean;
  billboardAds?: boolean;
  eventMarketing?: boolean;
  tradeShowExhibition?: boolean;
  influencerMarketing?: boolean;
  affiliateMarketing?: boolean;
  leadGeneration?: boolean;
  telemarketing?: boolean;
  outdoorAdvertising?: boolean;
  prServices?: boolean;
  marketResearch?: boolean;
  brandConsulting?: boolean;
  marketingAutomation?: boolean;
  analyticsReporting?: boolean;
  conversionOptimization?: boolean;
  emiAvailable?: boolean;
  pricing?: string;
  startingPrice?: number;
  hourlyRate?: number;
  projectBased?: boolean;
  retainerModel?: boolean;
  commissionBased?: boolean;
  freeConsultation?: boolean;
  freeDemo?: boolean;
  certifiedExperts?: boolean;
  guaranteedResults?: boolean;
  experienceYears?: number;
  certifications?: string;
  teamSize?: number;
  portfolio?: string;
  clientReferences?: string;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};


export default function SalesMarketingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<SalesMarketingFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["sales-marketing"],
    queryFn: async () => {
      const response = await fetch("/api/admin/sales-marketing");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SalesMarketingFormData) => {
      const response = await fetch("/api/admin/sales-marketing", {
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
      queryClient.invalidateQueries({ queryKey: ["sales-marketing"] });
      toast({ title: "Success", description: "Sales & Marketing service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SalesMarketingFormData }) => {
      const response = await fetch(`/api/admin/sales-marketing/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["sales-marketing"] });
      toast({ title: "Success", description: "Sales & Marketing service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/sales-marketing/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-marketing"] });
      toast({ title: "Success", description: "Service deleted successfully" });
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
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        setValue(key as any, service[key]);
      }
    });
    setIsDialogOpen(true);
  };

  const handleView = (service: any) => setViewingService(service);
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) deleteMutation.mutate(id);
  };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload-multiple", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : [];
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingImages(true);
    setImageError(null);
    try {
      const urls = await uploadMultipleFiles(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) { setImageError(err.message); }
    finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = (data: SalesMarketingFormData) => {
    const payload = { ...data, images };
    editingService ? updateMutation.mutate({ id: editingService.id, data: payload }) : createMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales & Marketing Services</h1>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div><CardTitle className="text-lg">{service.title}</CardTitle><p className="text-sm text-muted-foreground">{service.businessName}</p></div>
                {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Category:</strong> {service.serviceCategory}</p>
                <p><strong>Location:</strong> {service.city}, {service.state}</p>
                {service.startingPrice && <p><strong>Starting:</strong> ₹{service.startingPrice}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4 mr-1" /> View</Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isLoading && <div className="text-center py-12 text-muted-foreground">No services found</div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Sales & Marketing Service</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="title">Title *</Label><Input id="title" {...register("title", { required: true })} placeholder="Service Title" /></div>
              <div><Label htmlFor="businessName">Business Name</Label><Input id="businessName" {...register("businessName")} placeholder="Company Name" /></div>
              <div>
                <Label htmlFor="serviceCategory">Category</Label>
                <Select onValueChange={(value) => setValue("serviceCategory", value)} defaultValue={editingService?.serviceCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="SEO Services">SEO Services</SelectItem>
                    <SelectItem value="Social Media Marketing">Social Media Marketing</SelectItem>
                    <SelectItem value="Content Marketing">Content Marketing</SelectItem>
                    <SelectItem value="Traditional Marketing">Traditional Marketing</SelectItem>
                    <SelectItem value="Brand Marketing">Brand Marketing</SelectItem>
                    <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                    <SelectItem value="Marketing Agency">Marketing Agency</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="contactPerson">Contact Person *</Label><Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="Contact Person" /></div>
              <div><Label htmlFor="contactPhone">Phone *</Label><Input id="contactPhone" {...register("contactPhone", { required: true })} placeholder="Phone Number" /></div>
              <div><Label htmlFor="contactEmail">Email</Label><Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="Email Address" /></div>
              <div><Label htmlFor="website">Website</Label><Input id="website" {...register("website")} placeholder="Website URL" /></div>
              <div><Label htmlFor="city">City *</Label><Input id="city" {...register("city", { required: true })} placeholder="City" /></div>
              <div><Label htmlFor="state">State</Label><Input id="state" {...register("state")} placeholder="State" /></div>
              <div><Label htmlFor="fullAddress">Full Address</Label><Input id="fullAddress" {...register("fullAddress")} placeholder="Full Address" /></div>
              <div><Label htmlFor="startingPrice">Starting Price (₹)</Label><Input id="startingPrice" type="number" {...register("startingPrice")} placeholder="Starting Price" /></div>
              <div><Label htmlFor="hourlyRate">Hourly Rate (₹)</Label><Input id="hourlyRate" type="number" {...register("hourlyRate")} placeholder="Hourly Rate" /></div>
              <div><Label htmlFor="teamSize">Team Size</Label><Input id="teamSize" type="number" {...register("teamSize")} placeholder="Team Size" /></div>
              <div><Label htmlFor="experienceYears">Experience (Years)</Label><Input id="experienceYears" type="number" {...register("experienceYears")} placeholder="Years of Experience" /></div>
              <div><Label htmlFor="certifications">Certifications</Label><Input id="certifications" {...register("certifications")} placeholder="Certifications" /></div>
              <div><Label htmlFor="workingHours">Working Hours</Label><Input id="workingHours" {...register("workingHours")} placeholder="9 AM - 6 PM" /></div>
            </div>

            <div className="space-y-3"><Label>Digital Marketing Services</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["digitalMarketing", "seoServices", "socialMediaMarketing", "contentMarketing", "emailMarketing", "ppcAdvertising", "brandMarketing", "influencerMarketing", "analyticsReporting", "marketingAutomation"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" /><Label htmlFor={item} className="text-sm font-normal">{item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label></div>
                ))}
              </div>
            </div>

            <div className="space-y-3"><Label>Traditional Marketing</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["offlineMarketing", "televisionAds", "radioAds", "newspaperAds", "billboardAds", "eventMarketing", "tradeShowExhibition", "outdoorAdvertising", "prServices", "telemarketing"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" /><Label htmlFor={item} className="text-sm font-normal">{item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label></div>
                ))}
              </div>
            </div>

            <div className="space-y-3"><Label>Other Services</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["leadGeneration", "marketResearch", "brandConsulting", "conversionOptimization", "affiliateMarketing"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" /><Label htmlFor={item} className="text-sm font-normal">{item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label></div>
                ))}
              </div>
            </div>

            <div className="space-y-3"><Label>Pricing Models</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["freeConsultation", "freeDemo", "projectBased", "retainerModel", "commissionBased", "certifiedExperts", "guaranteedResults"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" /><Label htmlFor={item} className="text-sm font-normal">{item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label></div>
                ))}
              </div>
            </div>

            <div><Label htmlFor="description">Description</Label><Textarea id="description" {...register("description")} placeholder="Describe your services..." rows={4} /></div>

            <div><Label>Images</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (<div key={idx} className="relative"><img src={img} alt={`Upload ${idx + 1}`} className="w-24 h-24 object-cover rounded-md" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"><X className="h-3 w-3" /></button></div>))}
                <label className="cursor-pointer"><input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" /><div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-primary"><Plus className="h-8 w-8 text-gray-400" /></div></label>
              </div>
              {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
              {uploadingImages && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><input type="checkbox" {...register("isActive")} id="isActive" className="w-4 h-4" defaultChecked={editingService?.isActive ?? true} /><Label htmlFor="isActive" className="font-normal">Active</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" {...register("isFeatured")} id="isFeatured" className="w-4 h-4" defaultChecked={editingService?.isFeatured ?? false} /><Label htmlFor="isFeatured" className="font-normal">Featured</Label></div>
            </div>

            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">{createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update Service" : "Create Service"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{viewingService?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {viewingService?.images?.length > 0 && (<div className="grid grid-cols-2 gap-2">{viewingService.images.map((img: string, idx: number) => (<img key={idx} src={img} alt={`Service ${idx + 1}`} className="w-full h-40 object-cover rounded-md" />))}</div>)}
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Category:</strong> {viewingService?.serviceCategory}</div>
              <div><strong>Business:</strong> {viewingService?.businessName}</div>
              <div><strong>Contact:</strong> {viewingService?.contactPhone}</div>
              <div><strong>Location:</strong> {viewingService?.city}, {viewingService?.state}</div>
              <div><strong>Experience:</strong> {viewingService?.experienceYears || "N/A"} years</div>
              <div><strong>Team Size:</strong> {viewingService?.teamSize || "N/A"}</div>
            </div>
            {viewingService?.description && (<div><strong>Description:</strong><p className="mt-1">{viewingService.description}</p></div>)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}