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
import { Plus, Edit, Trash2, Eye, Dog, X } from "lucide-react";

type PetCareFormData = {
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
  petTypes?: string[];
  services?: string[];
  serviceMode?: string;
  homeVisit?: boolean;
  clinicVisit?: boolean;
  onlineConsultation?: boolean;
  emergencyService?: boolean;
  hoursAvailable?: string;
  available24_7?: boolean;
  priceRange?: string;
  consultationFee?: number;
  groomingPrice?: number;
  boardingPricePerDay?: number;
  daycarePricePerDay?: number;
  trainingPricePerSession?: number;
  vaccinationPrice?: number;
  petFoodBrands?: string;
  petFoodCategories?: string;
  petFoodAvailable?: boolean;
  petToysAvailable?: boolean;
  petAccessoriesAvailable?: boolean;
  organicPetFood?: boolean;
  grainFreeFood?: boolean;
  prescriptionFood?: boolean;
  puppyFood?: boolean;
  adultDogFood?: boolean;
  seniorDogFood?: boolean;
  catFood?: boolean;
  fishFood?: boolean;
  birdFood?: boolean;
  smallPetFood?: boolean;
  deliveryAvailable?: boolean;
  freeDelivery?: boolean;
  cashOnDelivery?: boolean;
  onlinePayment?: boolean;
  petGrooming?: boolean;
  petBoarding?: boolean;
  petDaycare?: boolean;
  petTraining?: boolean;
  petWalking?: boolean;
  petSitting?: boolean;
  veterinaryService?: boolean;
  petPhotography?: boolean;
  petInsurance?: boolean;
  licensedVet?: boolean;
  certifiedTrainer?: boolean;
  experienceYears?: number;
  certifications?: string;
  languagesKnown?: string;
  workingHours?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};


export default function PetCarePetFoodForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<PetCareFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["pet-care"],
    queryFn: async () => {
      const response = await fetch("/api/admin/pet-care");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PetCareFormData) => {
      const response = await fetch("/api/admin/pet-care", {
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
      queryClient.invalidateQueries({ queryKey: ["pet-care"] });
      toast({ title: "Success", description: "Pet Care service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PetCareFormData }) => {
      const response = await fetch(`/api/admin/pet-care/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["pet-care"] });
      toast({ title: "Success", description: "Pet Care service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/pet-care/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet-care"] });
      toast({ title: "Success", description: "Pet Care service deleted successfully" });
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

  const handleView = (service: any) => {
    setViewingService(service);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload-multiple", { method: "POST", body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const urls = Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : [];
    if (urls.length === 0) throw new Error("Upload failed: missing files");
    return urls as string[];
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingImages(true);
    setImageError(null);
    try {
      const urls = await uploadMultipleFiles(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setImageError(err.message);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PetCareFormData) => {
    const payload = { ...data, images };
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pet Care & Pet Food Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.businessName}</p>
                </div>
                {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Category:</strong> {service.serviceCategory}</p>
                <p className="text-sm"><strong>Location:</strong> {service.city}, {service.state}</p>
                <p className="text-sm"><strong>Contact:</strong> {service.contactPhone}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleView(service)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">No services found. Add your first service!</div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Pet Care/Pet Food Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Service/Shop Name" />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" {...register("businessName")} placeholder="Business Name" />
              </div>
              <div>
                <Label htmlFor="serviceCategory">Service Category</Label>
                <Select onValueChange={(value) => setValue("serviceCategory", value)} defaultValue={editingService?.serviceCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pet Shop">Pet Shop</SelectItem>
                    <SelectItem value="Pet Grooming">Pet Grooming</SelectItem>
                    <SelectItem value="Pet Boarding">Pet Boarding</SelectItem>
                    <SelectItem value="Pet Daycare">Pet Daycare</SelectItem>
                    <SelectItem value="Pet Training">Pet Training</SelectItem>
                    <SelectItem value="Veterinary Clinic">Veterinary Clinic</SelectItem>
                    <SelectItem value="Pet Food Store">Pet Food Store</SelectItem>
                    <SelectItem value="Pet Walking">Pet Walking</SelectItem>
                    <SelectItem value="Pet Sitting">Pet Sitting</SelectItem>
                    <SelectItem value="Pet Insurance">Pet Insurance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="Contact Person" />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input id="contactPhone" {...register("contactPhone", { required: true })} placeholder="Phone Number" />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="Email Address" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register("website")} placeholder="Website URL" />
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
                <Input id="country" {...register("country")} defaultValue="India" placeholder="Country" />
              </div>
              <div>
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input id="fullAddress" {...register("fullAddress")} placeholder="Full Address" />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience (Years)</Label>
                <Input id="experienceYears" type="number" {...register("experienceYears")} placeholder="Years of Experience" />
              </div>
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Input id="certifications" {...register("certifications")} placeholder="Certifications" />
              </div>
              <div>
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input id="workingHours" {...register("workingHours")} placeholder="9 AM - 7 PM" />
              </div>
              <div>
                <Label htmlFor="languagesKnown">Languages Known</Label>
                <Input id="languagesKnown" {...register("languagesKnown")} placeholder="English, Hindi, etc." />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Pet Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["Dog", "Cat", "Bird", "Fish", "Rabbit", "Hamster", "Guinea Pig", "Turtle"].map((pet) => (
                  <div key={pet} className="flex items-center gap-2">
                    <input type="checkbox" value={pet} {...register("petTypes")} id={pet} className="w-4 h-4" />
                    <Label htmlFor={pet} className="text-sm font-normal">{pet}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Services Offered</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "petGrooming", "petBoarding", "petDaycare", "petTraining",
                  "petWalking", "petSitting", "veterinaryService", "petPhotography", "petInsurance"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Service Mode</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "homeVisit", "clinicVisit", "onlineConsultation", "emergencyService"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Pet Food Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "puppyFood", "adultDogFood", "seniorDogFood", "catFood", "fishFood", "birdFood", "smallPetFood"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Food Special Options</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "organicPetFood", "grainFreeFood", "prescriptionFood"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Products Available</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "petFoodAvailable", "petToysAvailable", "petAccessoriesAvailable", "deliveryAvailable"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                <Input id="consultationFee" type="number" {...register("consultationFee")} placeholder="Consultation Fee" />
              </div>
              <div>
                <Label htmlFor="groomingPrice">Grooming Price (₹)</Label>
                <Input id="groomingPrice" type="number" {...register("groomingPrice")} placeholder="Grooming Price" />
              </div>
              <div>
                <Label htmlFor="boardingPricePerDay">Boarding/Day (₹)</Label>
                <Input id="boardingPricePerDay" type="number" {...register("boardingPricePerDay")} placeholder="Boarding Price per day" />
              </div>
            </div>

            <div>
              <Label htmlFor="petFoodBrands">Pet Food Brands Available</Label>
              <Input id="petFoodBrands" {...register("petFoodBrands")} placeholder="Royal Canin, Pedigree, etc." />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Describe your services..." rows={4} />
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-24 h-24 object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-primary">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                </label>
              </div>
              {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
              {uploadingImages && <p className="text-blue-500 text-sm mt-1">Uploading images...</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isActive")} id="isActive" className="w-4 h-4" defaultChecked={editingService?.isActive ?? true} />
                <Label htmlFor="isActive" className="font-normal">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isFeatured")} id="isFeatured" className="w-4 h-4" defaultChecked={editingService?.isFeatured ?? false} />
                <Label htmlFor="isFeatured" className="font-normal">Featured</Label>
              </div>
            </div>

            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update Service" : "Create Service"}
            </Button>
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
              <div><strong>Contact Person:</strong> {viewingService?.contactPerson}</div>
              <div><strong>Phone:</strong> {viewingService?.contactPhone}</div>
              <div><strong>Email:</strong> {viewingService?.contactEmail || "N/A"}</div>
              <div><strong>Location:</strong> {viewingService?.city}, {viewingService?.state}</div>
              <div><strong>Experience:</strong> {viewingService?.experienceYears || "N/A"} years</div>
            </div>
            {viewingService?.description && (
              <div><strong>Description:</strong><p className="mt-1">{viewingService.description}</p></div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}