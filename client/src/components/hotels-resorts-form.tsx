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

type HotelsResortsFormData = {
  title: string;
  description?: string;
  propertyType: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  starRating?: number;
  numberOfRooms?: number;
  checkInTime?: string;
  checkOutTime?: string;
  pricePerNight?: number;
  pricePerNightMin?: number;
  pricePerNightMax?: number;
  currency?: string;
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  areaName?: string;
  latitude?: number;
  longitude?: number;
  roomTypes?: string[];
  amenities?: string[];
  facilities?: string[];
  parkingAvailable?: boolean;
  wifiAvailable?: boolean;
  restaurantAvailable?: boolean;
  barAvailable?: boolean;
  roomService?: boolean;
  laundryService?: boolean;
  gymAvailable?: boolean;
  poolAvailable?: boolean;
  spaAvailable?: boolean;
  conferenceRoom?: boolean;
  banquetHall?: boolean;
  airportTransfer?: boolean;
  travelDesk?: boolean;
  petFriendly?: boolean;
  smokingAllowed?: boolean;
  creditCardAccepted?: boolean;
  onlineBookingAvailable?: boolean;
  instantBooking?: boolean;
  freeCancellation?: boolean;
  payAtHotel?: boolean;
  governmentIdRequired?: boolean;
  couplesFriendly?: boolean;
  bachelorFriendly?: boolean;
  workingHours?: string;
  languagesKnown?: string;
  certifications?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  checkInPolicy?: string;
  checkOutPolicy?: string;
  cancellationPolicy?: string;
  specialOffers?: string;
  nearbyAttractions?: string;
  distanceFromAirport?: string;
  distanceFromRailway?: string;
  distanceFromBusStand?: string;
};


export default function HotelsResortsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<HotelsResortsFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["hotels-resorts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/hotels-resorts");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: HotelsResortsFormData) => {
      const response = await fetch("/api/admin/hotels-resorts", {
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
      queryClient.invalidateQueries({ queryKey: ["hotels-resorts"] });
      toast({ title: "Success", description: "Hotel/Resort created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: HotelsResortsFormData }) => {
      const response = await fetch(`/api/admin/hotels-resorts/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["hotels-resorts"] });
      toast({ title: "Success", description: "Hotel/Resort updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/hotels-resorts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels-resorts"] });
      toast({ title: "Success", description: "Hotel/Resort deleted successfully" });
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
    if (confirm("Are you sure you want to delete this property?")) {
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

  const onSubmit = (data: HotelsResortsFormData) => {
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
        <h1 className="text-2xl font-bold">Hotels & Resorts Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Property
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
                <div className="flex gap-1">
                  {service.starRating && <Badge>{service.starRating} ★</Badge>}
                  {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Type:</strong> {service.propertyType}</p>
                <p className="text-sm"><strong>Location:</strong> {service.city}, {service.state}</p>
                <p className="text-sm"><strong>Contact:</strong> {service.contactPhone}</p>
                {service.pricePerNight && (
                  <p className="text-sm"><strong>Price:</strong> ₹{service.pricePerNight}/night</p>
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
        <div className="text-center py-12 text-muted-foreground">No properties found. Add your first property!</div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Hotel/Resort</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Property Name *</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Hotel/Resort Name" />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" {...register("businessName")} placeholder="Owner/Company Name" />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select onValueChange={(value) => setValue("propertyType", value)} defaultValue={editingService?.propertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                    <SelectItem value="Resort">Resort</SelectItem>
                    <SelectItem value="Guest House">Guest House</SelectItem>
                    <SelectItem value="Homestay">Homestay</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Farm Stay">Farm Stay</SelectItem>
                    <SelectItem value="Beach Resort">Beach Resort</SelectItem>
                    <SelectItem value="Hill Resort">Hill Resort</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="starRating">Star Rating</Label>
                <Select onValueChange={(value) => setValue("starRating", parseInt(value))} defaultValue={editingService?.starRating?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Star</SelectItem>
                    <SelectItem value="3">3 Star</SelectItem>
                    <SelectItem value="4">4 Star</SelectItem>
                    <SelectItem value="5">5 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="Manager Name" />
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
                <Label htmlFor="areaName">Area/Locality</Label>
                <Input id="areaName" {...register("areaName")} placeholder="Area Name" />
              </div>
              <div>
                <Label htmlFor="pricePerNight">Price Per Night (₹)</Label>
                <Input id="pricePerNight" type="number" {...register("pricePerNight")} placeholder="Starting Price" />
              </div>
              <div>
                <Label htmlFor="numberOfRooms">Number of Rooms</Label>
                <Input id="numberOfRooms" type="number" {...register("numberOfRooms")} placeholder="Total Rooms" />
              </div>
              <div>
                <Label htmlFor="checkInTime">Check-In Time</Label>
                <Input id="checkInTime" {...register("checkInTime")} placeholder="12:00 PM" />
              </div>
              <div>
                <Label htmlFor="checkOutTime">Check-Out Time</Label>
                <Input id="checkOutTime" {...register("checkOutTime")} placeholder="11:00 AM" />
              </div>
              <div>
                <Label htmlFor="distanceFromAirport">Distance from Airport</Label>
                <Input id="distanceFromAirport" {...register("distanceFromAirport")} placeholder="e.g. 10 km" />
              </div>
              <div>
                <Label htmlFor="workingHours">Reception Hours</Label>
                <Input id="workingHours" {...register("workingHours")} placeholder="24/7 or 8 AM - 10 PM" />
              </div>
              <div>
                <Label htmlFor="languagesKnown">Languages Known</Label>
                <Input id="languagesKnown" {...register("languagesKnown")} placeholder="English, Hindi, etc." />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Room Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "wifiAvailable", "parkingAvailable", "roomService", "laundryService",
                  "airConditioning", "tvAvailable", "miniBar", "safeAvailable",
                  "balcony", "roomHeater", "coffeeMaker", "ironBoard"
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
              <Label>Property Facilities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "restaurantAvailable", "barAvailable", "gymAvailable", "poolAvailable",
                  "spaAvailable", "conferenceRoom", "banquetHall", "airportTransfer",
                  "travelDesk", "petFriendly"
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
              <Label>Booking Options</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "onlineBookingAvailable", "instantBooking", "freeCancellation", "payAtHotel",
                  "creditCardAccepted", "couplesFriendly", "bachelorFriendly", "governmentIdRequired"
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
              <Textarea id="description" {...register("description")} placeholder="Describe your property..." rows={4} />
            </div>

            <div>
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Textarea id="cancellationPolicy" {...register("cancellationPolicy")} placeholder="Cancellation terms..." rows={2} />
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
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update Property" : "Create Property"}
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
                  <img key={idx} src={img} alt={`Property ${idx + 1}`} className="w-full h-40 object-cover rounded-md" />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Property Type:</strong> {viewingService?.propertyType}</div>
              <div><strong>Star Rating:</strong> {viewingService?.starRating || "N/A"} ★</div>
              <div><strong>Contact Person:</strong> {viewingService?.contactPerson}</div>
              <div><strong>Phone:</strong> {viewingService?.contactPhone}</div>
              <div><strong>Email:</strong> {viewingService?.contactEmail || "N/A"}</div>
              <div><strong>Location:</strong> {viewingService?.city}, {viewingService?.state}</div>
              <div><strong>Price:</strong> ₹{viewingService?.pricePerNight || "N/A"}/night</div>
              <div><strong>Rooms:</strong> {viewingService?.numberOfRooms || "N/A"}</div>
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