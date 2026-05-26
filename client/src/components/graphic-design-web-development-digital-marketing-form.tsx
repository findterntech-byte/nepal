import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";

type GraphicDesignFormData = {
  title: string;
  description?: string;
  serviceCategory: string;
  businessName?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  digitalMarketing?: boolean;
  seoServices?: boolean;
  socialMediaMarketing?: boolean;
  contentMarketing?: boolean;
  brandMarketing?: boolean;
  leadGeneration?: boolean;
  startingPrice?: number;
  hourlyRate?: number;
  projectBased?: boolean;
  retainerModel?: boolean;
  freeConsultation?: boolean;
  certifiedExperts?: boolean;
  guaranteedResults?: boolean;
  teamSize?: number;
  experienceYears?: number;
  certifications?: string;
  portfolio?: string;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function GraphicDesignWebDevelopmentDigitalMarketingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<GraphicDesignFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-graphic-design-web-development-digital-marketing"],
    queryFn: async () => {
      const res = await fetch("/api/admin/graphic-design-web-development-digital-marketing");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: GraphicDesignFormData) => {
      const response = await fetch("/api/admin/graphic-design-web-development-digital-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to create service" }));
        throw new Error(error.message || "Failed to create service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-graphic-design-web-development-digital-marketing"] });
      toast({ title: "Success", description: "Service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GraphicDesignFormData }) => {
      const response = await fetch(`/api/admin/graphic-design-web-development-digital-marketing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to update service" }));
        throw new Error(error.message || "Failed to update service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-graphic-design-web-development-digital-marketing"] });
      toast({ title: "Success", description: "Service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/graphic-design-web-development-digital-marketing/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to delete service" }));
        throw new Error(error.message || "Failed to delete service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-graphic-design-web-development-digital-marketing"] });
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
    Object.keys(service).forEach((key) => {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        setValue(key as any, service[key]);
      }
    });
    setIsDialogOpen(true);
  };

  const handleView = (service: any) => setViewingService(service);

  const uploadMultipleFiles = async (files: File[]) => {
    const fd = new FormData();
    files.forEach((file) => fd.append("files", file));
    const res = await fetch("/api/admin/upload-multiple", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return Array.isArray(data?.files) ? data.files.map((file: any) => file?.url).filter((url: any) => typeof url === "string") : [];
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingImages(true);
    setImageError(null);
    try {
      const urls = await uploadMultipleFiles(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (error: any) {
      setImageError(error.message);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = (data: GraphicDesignFormData) => {
    const payload = { ...data, images };
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Graphic Design, Web Development & Digital Marketing</h1>
          <p className="text-muted-foreground mt-1">Manage listings for creative, development and marketing services.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New Listing</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-3">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.businessName}</p>
                </div>
                {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p><strong>Category:</strong> {service.serviceCategory}</p>
                <p><strong>Location:</strong> {service.city}{service.state ? `, ${service.state}` : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.digitalMarketing && <Badge variant="outline">Digital</Badge>}
                {service.seoServices && <Badge variant="outline">SEO</Badge>}
                {service.socialMediaMarketing && <Badge variant="outline">Social</Badge>}
                {service.contentMarketing && <Badge variant="outline">Content</Badge>}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4 mr-1" /> View</Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(service.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isLoading && <div className="text-center py-12 text-muted-foreground">No listings to display.</div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Service Listing</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Service title" />
              </div>
              <div>
                <Label htmlFor="serviceCategory">Service Category *</Label>
                <Select onValueChange={(value) => setValue("serviceCategory", value)} defaultValue={editingService?.serviceCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" {...register("businessName")} placeholder="Company or freelancer" />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="Name" />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input id="contactPhone" {...register("contactPhone", { required: true })} placeholder="Phone number" />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="Email address" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register("website")} placeholder="https://" />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city", { required: true })} placeholder="City" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} placeholder="State" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} placeholder="Country" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input id="fullAddress" {...register("fullAddress")} placeholder="Full address" />
              </div>
              <div>
                <Label htmlFor="startingPrice">Starting Price (रू )</Label>
                <Input id="startingPrice" type="number" {...register("startingPrice", { valueAsNumber: true })} placeholder="Starting price" />
              </div>
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (रू )</Label>
                <Input id="hourlyRate" type="number" {...register("hourlyRate", { valueAsNumber: true })} placeholder="Hourly rate" />
              </div>
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input id="teamSize" type="number" {...register("teamSize", { valueAsNumber: true })} placeholder="Team size" />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience Years</Label>
                <Input id="experienceYears" type="number" {...register("experienceYears", { valueAsNumber: true })} placeholder="Years of experience" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} rows={4} placeholder="Describe the service" />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Key Service Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { key: "digitalMarketing", label: "Digital Marketing" },
                  { key: "seoServices", label: "SEO" },
                  { key: "socialMediaMarketing", label: "Social Media" },
                  { key: "contentMarketing", label: "Content" },
                  { key: "brandMarketing", label: "Brand" },
                  { key: "leadGeneration", label: "Lead Gen" },
                ].map((option) => (
                  <label key={option.key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register(option.key as any)} className="w-4 h-4" />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Delivery & Pricing</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { key: "projectBased", label: "Project Based" },
                  { key: "retainerModel", label: "Retainer" },
                  { key: "freeConsultation", label: "Free Consultation" },
                  { key: "certifiedExperts", label: "Certified Experts" },
                  { key: "guaranteedResults", label: "Guaranteed Results" },
                ].map((option) => (
                  <label key={option.key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register(option.key as any)} className="w-4 h-4" />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 overflow-hidden rounded-md">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer inline-flex items-center justify-center w-24 h-24 rounded-md border border-dashed border-gray-300 hover:border-primary">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
                  <Plus className="h-6 w-6 text-gray-500" />
                </label>
              </div>
              {imageError && <p className="text-sm text-red-600 mt-1">{imageError}</p>}
              {uploadingImages && <p className="text-sm text-muted-foreground mt-1">Uploading images...</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isActive" as any)} className="w-4 h-4" defaultChecked={editingService?.isActive ?? true} />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isFeatured" as any)} className="w-4 h-4" defaultChecked={editingService?.isFeatured ?? false} />
                <span>Featured</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingService ? (updateMutation.isPending ? "Updating..." : "Update Listing") : (createMutation.isPending ? "Saving..." : "Create Listing")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingService?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewingService?.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {viewingService.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`Service ${idx + 1}`} className="w-full h-40 object-cover rounded-md" />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Category:</strong> {viewingService?.serviceCategory}</div>
              <div><strong>Business:</strong> {viewingService?.businessName}</div>
              <div><strong>Contact:</strong> {viewingService?.contactPhone}</div>
              <div><strong>Location:</strong> {viewingService?.city}{viewingService?.state ? `, ${viewingService.state}` : ""}</div>
              <div><strong>Experience:</strong> {viewingService?.experienceYears ?? "N/A"} years</div>
              <div><strong>Team Size:</strong> {viewingService?.teamSize ?? "N/A"}</div>
            </div>
            {viewingService?.description && <div><strong>Description:</strong><p className="mt-1 text-sm text-muted-foreground">{viewingService.description}</p></div>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
