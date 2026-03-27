import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { X, Eye, Edit, Trash2, Plus, MapPin, Phone } from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface CarBikeRentalFormData {
  id?: string;
  title: string;
  description?: string;
  rentalType: string;
  brand: string;
  model: string;
  year?: number;
  rentalPricePerDay: number;
  rentalPricePerHour?: number;
  rentalPricePerWeek?: number;
  rentalPricePerMonth?: number;
  securityDeposit?: number;
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
  mileageLimitPerDay?: number;
  extraKmCharge?: number;
  color?: string;
  registrationNumber?: string;
  insuranceIncluded?: boolean;
  fuelPolicy?: string;
  condition?: string;
  minimumRentalDuration?: number;
  minimumRentalDurationUnit?: string;
  maximumRentalDuration?: number;
  driverAvailable?: boolean;
  driverChargesPerDay?: number;
  ageRequirement?: number;
  licenseRequired?: boolean;
  pickupDeliveryAvailable?: boolean;
  pickupDeliveryCharges?: number;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  pickupLocation?: string;
  rentalCompanyName?: string;
  rentalCompanyContact?: string;
  rentalCompanyEmail?: string;
  termsAndConditions?: string;
  cancellationPolicy?: string;
  availabilityStatus?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
  documents?: string[];
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  role?: string;
}

function CarBikeRentalsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingRental, setEditingRental] = useState<CarBikeRentalFormData | null>(null);
  const [viewingRental, setViewingRental] = useState<CarBikeRentalFormData | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(String(s || '').trim());

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const [meta, content] = String(dataUrl || '').split(',');
    const match = /data:([^;]+);base64/i.exec(meta || '');
    const mime = match?.[1] || 'application/octet-stream';
    const binary = atob(content || '');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const url = data?.url;
    if (typeof url !== 'string' || url.length === 0) throw new Error('Upload failed: missing url');
    return url;
  };

  const ensureUploadedUrls = async (items: string[], prefix: string): Promise<string[]> => {
    const out: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const v = items[i];
      if (typeof v !== 'string' || v.length === 0) continue;
      if (!isDataMediaUrl(v)) {
        out.push(v);
        continue;
      }
      const file = dataUrlToFile(v, `${prefix}-${Date.now()}-${i}.bin`);
      const url = await uploadSingleFile(file);
      out.push(url);
    }
    return out;
  };

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
      }
    }
    return null;
  };

  const localUser = getUserFromLocalStorage();
  const userId = localUser?.id || user?.id;
  const userRole = localUser?.role || user?.role;

  const { register, handleSubmit, setValue, watch, reset } = useForm<CarBikeRentalFormData>({
    defaultValues: {
      country: "India",
      insuranceIncluded: true,
      licenseRequired: true,
      ageRequirement: 21,
      minimumRentalDuration: 1,
      minimumRentalDurationUnit: "day",
      availabilityStatus: "available",
      isActive: true,
      isFeatured: false,
      driverAvailable: false,
      pickupDeliveryAvailable: false,
      userId: userId,
      role: userRole,
    },
  });

  useEffect(() => {
    const fetchRentals = async () => {
      if (!userId) return;

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId);
        queryParams.append('role', userRole || 'user');

        const response = await fetch(`/api/car-bike-rentals?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          queryClient.setQueryData(["/api/car-bike-rentals", userId, userRole], data);
        }
      } catch (error) {
        console.error('Error fetching rentals in useEffect:', error);
      }
    };

    fetchRentals();
  }, [userId, userRole, queryClient]);

  // Fetch rentals list
  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ["/api/car-bike-rentals", userId, userRole],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      if (userRole) params.append('role', userRole);

      const response = await fetch(`/api/car-bike-rentals?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch rentals");
      return response.json();
    },
  });

  // Reset form when editing rental changes
  useEffect(() => {
    if (editingRental) {
      Object.entries(editingRental).forEach(([key, value]) => {
        setValue(key as keyof CarBikeRentalFormData, value);
      });
      setImages(editingRental.images || []);
      setDocuments(editingRental.documents || []);
      setFeatures(editingRental.features || []);
    } else {
      reset({
        country: "India",
        insuranceIncluded: true,
        licenseRequired: true,
        ageRequirement: 21,
        minimumRentalDuration: 1,
        minimumRentalDurationUnit: "day",
        availabilityStatus: "available",
        isActive: true,
        isFeatured: false,
        driverAvailable: false,
        pickupDeliveryAvailable: false,
        userId: userId,
        role: userRole,
      });
      setImages([]);
      setDocuments([]);
      setFeatures([]);
    }
  }, [editingRental, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: async (data: CarBikeRentalFormData) => {
      const url = editingRental ? `/api/car-bike-rentals/${editingRental.id}` : "/api/car-bike-rentals";
      const method = editingRental ? "PUT" : "POST";
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;

      const safeImages = await ensureUploadedUrls(images, 'image');
      const safeDocuments = await ensureUploadedUrls(documents, 'document');

      // Exclude system fields when updating
      const { id, createdAt, updatedAt, ...dataToSend } = data;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSend,
          images: safeImages,
          documents: safeDocuments,
          features,
          userId: userData?.id || userId,
          role: userData?.role || userRole,
          ownerId: userData?.id || userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingRental ? 'update' : 'create'} rental listing`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Rental listing ${editingRental ? 'updated' : 'created'} successfully`,
      });
      reset();
      setImages([]);
      setDocuments([]);
      setFeatures([]);
      setShowDialog(false);
      setEditingRental(null);
      queryClient.invalidateQueries({ queryKey: ["/api/car-bike-rentals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingRental ? 'update' : 'create'} rental listing`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/car-bike-rentals/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete rental");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Rental listing deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/car-bike-rentals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete rental listing",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (rental: CarBikeRentalFormData) => {
      const { id, createdAt, updatedAt, ...dataToSend } = rental;
      const response = await fetch(`/api/car-bike-rentals/${rental.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dataToSend, isActive: !rental.isActive }),
      });
      if (!response.ok) throw new Error("Failed to toggle active status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/car-bike-rentals"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (rental: CarBikeRentalFormData) => {
      const { id, createdAt, updatedAt, ...dataToSend } = rental;
      const response = await fetch(`/api/car-bike-rentals/${rental.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dataToSend, isFeatured: !rental.isFeatured }),
      });
      if (!response.ok) throw new Error("Failed to toggle featured status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/car-bike-rentals"] });
      toast({ title: "Success", description: "Featured status updated successfully" });
    },
  });

  const handleEdit = (rental: CarBikeRentalFormData) => {
    setEditingRental(rental);
    setShowDialog(true);
  };

  const handleView = (rental: CarBikeRentalFormData) => {
    setViewingRental(rental);
    setShowViewDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rental listing?")) return;
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingRental(null);
    setShowDialog(true);
  };

  const onSubmit = (data: CarBikeRentalFormData) => {
    createMutation.mutate(data);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadMultipleFiles = async (inFiles: File[]): Promise<string[]> => {
      const fd = new FormData();
      inFiles.forEach((f) => fd.append('files', f));
      const res = await fetch('/api/upload-multiple', { method: 'POST', body: fd });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({} as any));
        throw new Error(msg?.message || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      const urls = Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === 'string' && u.length > 0) : [];
      return urls;
    };

    try {
      const fileArr = Array.from(files);
      const newUrls = await uploadMultipleFiles(fileArr);

      setImages([...images, ...newUrls]);
      setValue("images", [...images, ...newUrls]);

      toast({
        title: "Success",
        description: `${newUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages);
  };


  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Car & Bike Rentals</h3>
            <p className="text-sm text-muted-foreground">Manage your rental listings</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rental
          </Button>
        </div>

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(rentals) && rentals.map((rental: CarBikeRentalFormData) => (
            <Card key={rental.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{rental.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{rental.rentalType}</Badge>
                      {rental.transmission && <Badge variant="outline">{rental.transmission}</Badge>}
                      {rental.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleView(rental)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(rental)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(rental.id!)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rental.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{rental.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-lg text-primary">₹{rental.rentalPricePerDay}/day</span>
                    <Badge variant={rental.availabilityStatus === 'available' ? 'default' : 'secondary'}>
                      {rental.availabilityStatus || 'available'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Brand:</span>
                      <span className="font-medium ml-1">{rental.brand}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium ml-1">{rental.model}</span>
                    </div>
                  </div>
                  {(rental.city || rental.areaName) && (
                    <div className="text-sm pt-2 border-t">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {[rental.areaName, rental.city, rental.stateProvince].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                  {rental.rentalCompanyName && (
                    <div className="text-sm pt-2 border-t">
                      <div className="font-medium">{rental.rentalCompanyName}</div>
                      {rental.rentalCompanyContact && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{rental.rentalCompanyContact}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {rental.features && rental.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {rental.features.slice(0, 3).map((feature: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {rental.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{rental.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button
                  variant={rental.isActive ? "outline" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleActiveMutation.mutate(rental)}
                >
                  {rental.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant={rental.isFeatured ? "secondary" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleFeaturedMutation.mutate(rental)}
                >
                  {rental.isFeatured ? "Unfeature" : "Feature"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {(!rentals || rentals.length === 0) && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">No rental listings found</div>
              <Button onClick={handleAddNew} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Rental
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) setEditingRental(null);
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRental ? 'Edit' : 'Add'} Car/Bike Rental Listing</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" {...register("title", { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="rentalType">Rental Type *</Label>
                    <Select onValueChange={(value) => setValue("rentalType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input id="brand" {...register("brand", { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" {...register("model", { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
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
                  <div>
                    <Label htmlFor="rentalPricePerDay">Price Per Day *</Label>
                    <Input id="rentalPricePerDay" type="number" {...register("rentalPricePerDay", { required: true, valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="rentalPricePerHour">Price Per Hour</Label>
                    <Input id="rentalPricePerHour" type="number" {...register("rentalPricePerHour", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="rentalPricePerWeek">Price Per Week</Label>
                    <Input id="rentalPricePerWeek" type="number" {...register("rentalPricePerWeek", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="rentalPricePerMonth">Price Per Month</Label>
                    <Input id="rentalPricePerMonth" type="number" {...register("rentalPricePerMonth", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <Input id="securityDeposit" type="number" {...register("securityDeposit", { valueAsNumber: true })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select onValueChange={(value) => setValue("fuelType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select onValueChange={(value) => setValue("transmission", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                    <Input id="seatingCapacity" type="number" {...register("seatingCapacity", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" {...register("color")} />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input id="registrationNumber" {...register("registrationNumber")} />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select onValueChange={(value) => setValue("condition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Rental Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minimumRentalDuration">Min Rental Duration</Label>
                    <Input id="minimumRentalDuration" type="number" {...register("minimumRentalDuration", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="minimumRentalDurationUnit">Duration Unit</Label>
                    <Select onValueChange={(value) => setValue("minimumRentalDurationUnit", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maximumRentalDuration">Max Rental Duration (days)</Label>
                    <Input id="maximumRentalDuration" type="number" {...register("maximumRentalDuration", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="mileageLimitPerDay">Mileage Limit/Day (km)</Label>
                    <Input id="mileageLimitPerDay" type="number" {...register("mileageLimitPerDay", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="extraKmCharge">Extra Km Charge (₹/km)</Label>
                    <Input id="extraKmCharge" type="number" {...register("extraKmCharge", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="ageRequirement">Min Age Requirement</Label>
                    <Input id="ageRequirement" type="number" {...register("ageRequirement", { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="insuranceIncluded" onCheckedChange={(checked) => setValue("insuranceIncluded", checked)} defaultChecked />
                    <Label htmlFor="insuranceIncluded">Insurance Included</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="licenseRequired" onCheckedChange={(checked) => setValue("licenseRequired", checked)} defaultChecked />
                    <Label htmlFor="licenseRequired">License Required</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fuelPolicy">Fuel Policy</Label>
                  <Select onValueChange={(value) => setValue("fuelPolicy", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_to_full">Full to Full</SelectItem>
                      <SelectItem value="same_to_same">Same to Same</SelectItem>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="not_included">Not Included</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="driverAvailable" onCheckedChange={(checked) => setValue("driverAvailable", checked)} />
                    <Label htmlFor="driverAvailable">Driver Available</Label>
                  </div>
                  <div>
                    <Label htmlFor="driverChargesPerDay">Driver Charges/Day</Label>
                    <Input id="driverChargesPerDay" type="number" {...register("driverChargesPerDay", { valueAsNumber: true })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pickupDeliveryAvailable" onCheckedChange={(checked) => setValue("pickupDeliveryAvailable", checked)} />
                    <Label htmlFor="pickupDeliveryAvailable">Pickup/Delivery Available</Label>
                  </div>
                  <div>
                    <Label htmlFor="pickupDeliveryCharges">Pickup/Delivery Charges</Label>
                    <Input id="pickupDeliveryCharges" type="number" {...register("pickupDeliveryCharges", { valueAsNumber: true })} />
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
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" {...register("country", { required: true })} defaultValue="India" />
                  </div>
                  <div>
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Input id="stateProvince" {...register("stateProvince")} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>
                  <div>
                    <Label htmlFor="areaName">Area Name</Label>
                    <Input id="areaName" {...register("areaName")} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fullAddress">Full Address</Label>
                  <Textarea id="fullAddress" {...register("fullAddress")} rows={2} />
                </div>
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input id="pickupLocation" {...register("pickupLocation")} />
                </div>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle>Rental Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rentalCompanyName">Company Name</Label>
                    <Input id="rentalCompanyName" {...register("rentalCompanyName")} />
                  </div>
                  <div>
                    <Label htmlFor="rentalCompanyContact">Contact Number</Label>
                    <Input id="rentalCompanyContact" {...register("rentalCompanyContact")} />
                  </div>
                  <div>
                    <Label htmlFor="rentalCompanyEmail">Email</Label>
                    <Input id="rentalCompanyEmail" type="email" {...register("rentalCompanyEmail")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="mt-2" />
                  {uploadingImages && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                </div>
                {images && images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {images.map((img: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-24  rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md">
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                  <Textarea id="termsAndConditions" {...register("termsAndConditions")} rows={3} />
                </div>
                <div>
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <Textarea id="cancellationPolicy" {...register("cancellationPolicy")} rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="availabilityStatus">Availability Status</Label>
                    <Select onValueChange={(value) => setValue("availabilityStatus", value)} defaultValue="available">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" onCheckedChange={(checked) => setValue("isActive", checked)} defaultChecked />
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
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? (editingRental ? "Updating..." : "Creating...")
                  : (editingRental ? "Update Rental Listing" : "Create Rental Listing")
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingRental?.title}</DialogTitle>
            <DialogDescription>Complete rental details</DialogDescription>
          </DialogHeader>
          {viewingRental && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant={viewingRental.isActive ? "default" : "secondary"}>
                  {viewingRental.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">{viewingRental.rentalType}</Badge>
                {viewingRental.transmission && <Badge variant="outline">{viewingRental.transmission}</Badge>}
                {viewingRental.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Per Day</p>
                  <p className="text-lg font-bold text-primary">₹{viewingRental.rentalPricePerDay}</p>
                </div>
                {viewingRental.rentalPricePerHour && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Per Hour</p>
                    <p className="text-lg font-bold">₹{viewingRental.rentalPricePerHour}</p>
                  </div>
                )}
                {viewingRental.rentalPricePerWeek && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Per Week</p>
                    <p className="text-lg font-bold">₹{viewingRental.rentalPricePerWeek}</p>
                  </div>
                )}
                {viewingRental.securityDeposit && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                    <p className="text-lg font-bold text-orange-600">₹{viewingRental.securityDeposit}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {viewingRental.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingRental.description}</p>
                </div>
              )}

              {/* Vehicle Details */}
              <div>
                <h3 className="font-semibold mb-2">Vehicle Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="font-medium">Brand:</span> {viewingRental.brand}</div>
                  <div><span className="font-medium">Model:</span> {viewingRental.model}</div>
                  {viewingRental.year && <div><span className="font-medium">Year:</span> {viewingRental.year}</div>}
                  {viewingRental.fuelType && <div><span className="font-medium">Fuel Type:</span> {viewingRental.fuelType}</div>}
                  {viewingRental.seatingCapacity && <div><span className="font-medium">Seating:</span> {viewingRental.seatingCapacity}</div>}
                  {viewingRental.color && <div><span className="font-medium">Color:</span> {viewingRental.color}</div>}
                </div>
              </div>

              {/* Location */}
              {viewingRental.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>{viewingRental.fullAddress}</p>
                    {(viewingRental.city || viewingRental.stateProvince) && (
                      <p>{[viewingRental.city, viewingRental.stateProvince].filter(Boolean).join(", ")}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Company Details */}
              {viewingRental.rentalCompanyName && (
                <div>
                  <h3 className="font-semibold mb-2">Rental Company</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{viewingRental.rentalCompanyName}</p>
                    {viewingRental.rentalCompanyContact && <p>{viewingRental.rentalCompanyContact}</p>}
                    {viewingRental.rentalCompanyEmail && <p>{viewingRental.rentalCompanyEmail}</p>}
                  </div>
                </div>
              )}

              {/* Features */}
              {viewingRental.features && viewingRental.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingRental.features.map((feature: string, idx: number) => (
                      <Badge key={idx} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms */}
              {viewingRental.termsAndConditions && (
                <div>
                  <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingRental.termsAndConditions}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CarBikeRentalsForm;