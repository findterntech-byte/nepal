
import { useState, useRef, Fragment } from "react";
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
import { Plus, Edit, Trash2, Eye, Wrench, Laptop, Smartphone, X } from "lucide-react";

type RepairServiceFormData = {
  title: string;
  description?: string;
  serviceType: string;
  businessName: string;
  baseServiceCharge: number;
  inspectionCharge?: number;
  pricingType?: string;
  freeInspection?: boolean;
  hardwareRepair?: boolean;
  softwareRepair?: boolean;
  dataRecovery?: boolean;
  virusRemoval?: boolean;
  screenReplacement?: boolean;
  batteryReplacement?: boolean;
  warrantyProvided?: boolean;
  warrantyPeriod?: string;
  genuinePartsUsed?: boolean;
  onsiteService?: boolean;
  pickupDeliveryService?: boolean;
  sameDayService?: boolean;
  emergencyService?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  city?: string;
  fullAddress: string;
  workingHours?: string;
  available24_7?: boolean;
  freeDiagnostic?: boolean;
  experienceYears?: number;
  certifiedTechnician?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
};


export default function  ComputerMobileLaptopRepairServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<RepairServiceFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["computer-mobile-laptop-repair-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/computer-mobile-laptop-repair-services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RepairServiceFormData) => {
      const response = await fetch("/api/admin/computer-mobile-laptop-repair-services", {
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
      queryClient.invalidateQueries({ queryKey: ["computer-mobile-laptop-repair-services"] });
      toast({ title: "Success", description: "Repair service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RepairServiceFormData }) => {
      const response = await fetch(`/api/admin/computer-mobile-laptop-repair-services/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["computer-mobile-laptop-repair-services"] });
      toast({ title: "Success", description: "Repair service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/computer-mobile-laptop-repair-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["computer-mobile-laptop-repair-services"] });
      toast({ title: "Success", description: "Repair service deleted successfully" });
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

      const res = await fetch("/api/admin/upload-multiple", {
        method: "POST",
        body: formData,
      });
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
      if (err) {
        setImageError(err);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    try {
      await uploadImageFiles(picked);
    } catch (e: any) {
      console.error(e);
      setImageError(e?.message || "Failed to upload images");
    }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: RepairServiceFormData) => {
    const payload: RepairServiceFormData = { ...data, images };
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'computer_repair':
        return <Laptop className="h-5 w-5 text-blue-600" />;
      case 'mobile_repair':
        return <Smartphone className="h-5 w-5 text-green-600" />;
      case 'laptop_repair':
        return <Laptop className="h-5 w-5 text-purple-600" />;
      default:
        return <Wrench className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Computer, Mobile & Laptop Repair Services</h2>
          <p className="text-muted-foreground">Manage device repair service providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Repair Service
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Fragment key={service.id}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-4">
                        {getServiceIcon(service.serviceType)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.businessName}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant="outline">{service.serviceType.replace('_', ' ')}</Badge>
                            {service.certifiedTechnician && <Badge className="bg-green-600">Certified</Badge>}
                            {service.warrantyProvided && <Badge className="bg-blue-600">Warranty</Badge>}
                            {service.available24_7 && <Badge className="bg-purple-600">24/7</Badge>}
                            {service.pickupDeliveryService && <Badge className="bg-orange-600">Pickup/Delivery</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Base Charge: ₹{Number(service.baseServiceCharge).toLocaleString()}
                            {service.freeInspection && <span className="ml-2 text-green-600 font-semibold">Free Inspection</span>}
                          </p>
                          {service.city && <p className="text-sm text-muted-foreground">{service.city}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewingService(service)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this service?")) {
                            deleteMutation.mutate(service.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Fragment>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Repair Service</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input id="title" {...register("title", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select onValueChange={(value) => setValue("serviceType", value)} defaultValue={editingService?.serviceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer_repair">Computer Repair</SelectItem>
                        <SelectItem value="mobile_repair">Mobile Repair</SelectItem>
                        <SelectItem value="laptop_repair">Laptop Repair</SelectItem>
                        <SelectItem value="tablet_repair">Tablet Repair</SelectItem>
                        <SelectItem value="all_devices">All Devices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input id="businessName" {...register("businessName", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Experience (Years)</Label>
                    <Input id="experienceYears" type="number" {...register("experienceYears", { valueAsNumber: true })} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="certifiedTechnician" onCheckedChange={(checked) => setValue("certifiedTechnician", checked)} />
                    <Label htmlFor="certifiedTechnician">Certified Technician</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseServiceCharge">Base Service Charge (₹) *</Label>
                    <Input id="baseServiceCharge" type="number" {...register("baseServiceCharge", { required: true, valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inspectionCharge">Inspection Charge (₹)</Label>
                    <Input id="inspectionCharge" type="number" {...register("inspectionCharge", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricingType">Pricing Type</Label>
                    <Select onValueChange={(value) => setValue("pricingType", value)} defaultValue={editingService?.pricingType || "fixed"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="estimated">Estimated</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="freeInspection" onCheckedChange={(checked) => setValue("freeInspection", checked)} />
                    <Label htmlFor="freeInspection">Free Inspection</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Offered */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="hardwareRepair" defaultChecked onCheckedChange={(checked) => setValue("hardwareRepair", checked)} />
                    <Label htmlFor="hardwareRepair">Hardware Repair</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="softwareRepair" defaultChecked onCheckedChange={(checked) => setValue("softwareRepair", checked)} />
                    <Label htmlFor="softwareRepair">Software Repair</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="dataRecovery" onCheckedChange={(checked) => setValue("dataRecovery", checked)} />
                    <Label htmlFor="dataRecovery">Data Recovery</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="virusRemoval" defaultChecked onCheckedChange={(checked) => setValue("virusRemoval", checked)} />
                    <Label htmlFor="virusRemoval">Virus Removal</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="screenReplacement" defaultChecked onCheckedChange={(checked) => setValue("screenReplacement", checked)} />
                    <Label htmlFor="screenReplacement">Screen Replacement</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="batteryReplacement" defaultChecked onCheckedChange={(checked) => setValue("batteryReplacement", checked)} />
                    <Label htmlFor="batteryReplacement">Battery Replacement</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                    <Input id="warrantyPeriod" {...register("warrantyPeriod")} placeholder="e.g., 3 months" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="warrantyProvided" onCheckedChange={(checked) => setValue("warrantyProvided", checked)} />
                    <Label htmlFor="warrantyProvided">Warranty Provided</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="genuinePartsUsed" defaultChecked onCheckedChange={(checked) => setValue("genuinePartsUsed", checked)} />
                    <Label htmlFor="genuinePartsUsed">Genuine Parts Used</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="onsiteService" onCheckedChange={(checked) => setValue("onsiteService", checked)} />
                    <Label htmlFor="onsiteService">Onsite Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="pickupDeliveryService" onCheckedChange={(checked) => setValue("pickupDeliveryService", checked)} />
                    <Label htmlFor="pickupDeliveryService">Pickup/Delivery Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="sameDayService" onCheckedChange={(checked) => setValue("sameDayService", checked)} />
                    <Label htmlFor="sameDayService">Same Day Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="emergencyService" onCheckedChange={(checked) => setValue("emergencyService", checked)} />
                    <Label htmlFor="emergencyService">Emergency Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="freeDiagnostic" onCheckedChange={(checked) => setValue("freeDiagnostic", checked)} />
                    <Label htmlFor="freeDiagnostic">Free Diagnostic</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input id="contactPerson" {...register("contactPerson", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" {...register("contactPhone", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="whatsappAvailable" onCheckedChange={(checked) => setValue("whatsappAvailable", checked)} />
                    <Label htmlFor="whatsappAvailable">WhatsApp Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input id="workingHours" {...register("workingHours")} placeholder="e.g., 9 AM - 8 PM" />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="fullAddress">Full Address *</Label>
                    <Input id="fullAddress" {...register("fullAddress", { required: true })} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} />
                    <Label htmlFor="available24_7">Available 24/7</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <Label>Upload Images (max 10)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        disabled={uploadingImages}
                        onChange={(e) => processFiles(e.target.files)}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {images.length}/10
                    </div>
                  </div>

                  {uploadingImages && <div className="text-sm text-muted-foreground">Uploading...</div>}
                  {imageError && <div className="text-sm text-red-600">{imageError}</div>}
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {images.map((url, idx) => (
                      <div key={`${url}-${idx}`} className="relative">
                        <img src={url} alt={`Repair service image ${idx + 1}`} className="h-20 w-full rounded-md border object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 bg-white/80 hover:bg-white"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingService && (
        <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingService.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Business Name</p>
                  <p className="text-sm text-muted-foreground">{viewingService.businessName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Service Type</p>
                  <p className="text-sm text-muted-foreground">{viewingService.serviceType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Base Charge</p>
                  <p className="text-sm text-muted-foreground">₹{Number(viewingService.baseServiceCharge).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{viewingService.contactPhone}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
