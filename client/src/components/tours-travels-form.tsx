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
import { Plus, Edit, Trash2, Eye, MapPin, X } from "lucide-react";

type ToursTravelsFormData = {
  title: string;
  description?: string;
  serviceCategory: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  serviceAreas?: string;
  operatingCountries?: string;
  operatingStates?: string;
  operatingCities?: string;
  tourTypes?: string[];
  packageTypes?: string[];
  priceRange?: string;
  startingPrice?: number;
  maxPrice?: number;
  groupDiscount?: boolean;
  childDiscount?: boolean;
  bookingMode?: string;
  paymentOptions?: string[];
  pickupAvailable?: boolean;
  dropAvailable?: boolean;
  guideAvailable?: boolean;
  accommodationIncluded?: boolean;
  mealIncluded?: boolean;
  transportIncluded?: boolean;
  insuranceIncluded?: boolean;
  visaAssistance?: boolean;
  flightBooking?: boolean;
  hotelBooking?: boolean;
  carRental?: boolean;
  visaServices?: boolean;
  passportServices?: boolean;
  travelInsurance?: boolean;
 customPackages?: boolean;
  domesticTours?: boolean;
  internationalTours?: boolean;
  adventureTours?: boolean;
  beachTours?: boolean;
  hillStationTours?: boolean;
  heritageTours?: boolean;
  wildlifeTours?: boolean;
  pilgrimageTours?: boolean;
  honeymoonTours?: boolean;
  familyTours?: boolean;
  corporateTours?: boolean;
  workingHours?: string;
  available24_7?: boolean;
  languagesKnown?: string;
  certifications?: string;
  experienceYears?: number;
  featuredDestination?: string;
  popularPackages?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
  fullAddress?: string;
  city?: string;
  state?: string;
  country?: string;
};


export default function ToursTravelsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ToursTravelsFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["tours-travels"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tours-travels");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ToursTravelsFormData) => {
      const response = await fetch("/api/admin/tours-travels", {
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
      queryClient.invalidateQueries({ queryKey: ["tours-travels"] });
      toast({ title: "Success", description: "Tours & Travels service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ToursTravelsFormData }) => {
      const response = await fetch(`/api/admin/tours-travels/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["tours-travels"] });
      toast({ title: "Success", description: "Tours & Travels service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/tours-travels/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours-travels"] });
      toast({ title: "Success", description: "Tours & Travels service deleted successfully" });
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

  const onSubmit = (data: ToursTravelsFormData) => {
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
        <h1 className="text-2xl font-bold">Tours & Travels Management</h1>
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
                {service.startingPrice && (
                  <p className="text-sm"><strong>Starting Price:</strong> ₹{service.startingPrice}</p>
                )}
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
            <DialogTitle>{editingService ? "Edit" : "Add"} Tours & Travels Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Service Title" />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" {...register("businessName", { required: true })} placeholder="Company/Agency Name" />
              </div>
              <div>
                <Label htmlFor="serviceCategory">Service Category</Label>
                <Select onValueChange={(value) => setValue("serviceCategory", value)} defaultValue={editingService?.serviceCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tour Operator">Tour Operator</SelectItem>
                    <SelectItem value="Travel Agency">Travel Agency</SelectItem>
                    <SelectItem value="Adventure Tour">Adventure Tour</SelectItem>
                    <SelectItem value="Car Rental">Car Rental</SelectItem>
                    <SelectItem value="Visa Consultant">Visa Consultant</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="Contact Person Name" />
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
                <Label htmlFor="whatsappAvailable">WhatsApp Available</Label>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" {...register("whatsappAvailable")} id="whatsappAvailable" className="w-4 h-4" />
                  <span className="text-sm">Yes, available on WhatsApp</span>
                </div>
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
                <Label htmlFor="startingPrice">Starting Price (₹)</Label>
                <Input id="startingPrice" type="number" {...register("startingPrice")} placeholder="Starting Price" />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price (₹)</Label>
                <Input id="maxPrice" type="number" {...register("maxPrice")} placeholder="Maximum Price" />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience (Years)</Label>
                <Input id="experienceYears" type="number" {...register("experienceYears")} placeholder="Years of Experience" />
              </div>
              <div>
                <Label htmlFor="languagesKnown">Languages Known</Label>
                <Input id="languagesKnown" {...register("languagesKnown")} placeholder="English, Hindi, etc." />
              </div>
              <div>
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input id="workingHours" {...register("workingHours")} placeholder="9 AM - 6 PM" />
              </div>
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Input id="certifications" {...register("certifications")} placeholder="ISO, IATA, etc." />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Services Offered</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "domesticTours", "internationalTours", "adventureTours", "beachTours",
                  "hillStationTours", "heritageTours", "wildlifeTours", "pilgrimageTours",
                  "honeymoonTours", "familyTours", "corporateTours", "customPackages"
                ].map((tourType) => (
                  <div key={tourType} className="flex items-center gap-2">
                    <input type="checkbox" {...register(tourType as any)} id={tourType} className="w-4 h-4" />
                    <Label htmlFor={tourType} className="text-sm font-normal">
                      {tourType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Package Inclusions</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "accommodationIncluded", "mealIncluded", "transportIncluded", "guideAvailable",
                  "insuranceIncluded", "pickupAvailable", "dropAvailable", "flightBooking",
                  "hotelBooking", "carRental", "visaAssistance", "passportServices"
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
              <div><strong>Business Name:</strong> {viewingService?.businessName}</div>
              <div><strong>Category:</strong> {viewingService?.serviceCategory}</div>
              <div><strong>Contact Person:</strong> {viewingService?.contactPerson}</div>
              <div><strong>Phone:</strong> {viewingService?.contactPhone}</div>
              <div><strong>Email:</strong> {viewingService?.contactEmail || "N/A"}</div>
              <div><strong>City:</strong> {viewingService?.city}, {viewingService?.state}</div>
              <div><strong>Starting Price:</strong> ₹{viewingService?.startingPrice || "N/A"}</div>
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