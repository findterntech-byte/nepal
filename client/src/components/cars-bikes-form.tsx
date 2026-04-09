
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface CarBike {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  emiAvailable?: boolean;
  emiStartingFrom?: number;
  emiMonths?: number;
  kilometersDriven?: number;
  fuelType?: string;
  transmission?: string;
  ownerNumber?: number;
  registrationNumber?: string;
  registrationState?: string;
  insuranceValidUntil?: string;
  color?: string;
  images?: string[];
  documents?: string[];
  features?: string[];
  condition?: string;
  isNegotiable: boolean;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  role?: string;
}

interface FormData extends Omit<CarBike, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'price' | 'year' | 'kilometersDriven' | 'ownerNumber' | 'emiAvailable' | 'emiStartingFrom' | 'emiMonths'> {
  price: string;
  year: number | string;
  kilometersDriven?: string;
  ownerNumber?: string;
  emiAvailable: boolean;
  emiStartingFrom: string;
  emiMonths: string;
  userId: string;
  role: string;
}

export function CarsBikesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarBike | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const res = await fetch('/api/upload-multiple', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const urls = Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === 'string') : [];
    if (urls.length === 0) throw new Error('Upload failed: missing files');
    return urls as string[];
  };

  const getUserData = () => {
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

  const localUser = getUserData();
  const userId = localUser?.id || user?.id || '';
  const userRole = localUser?.role || user?.role || 'user';

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    listingType: "sell",
    vehicleType: "car",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    emiAvailable: false,
    emiStartingFrom: "",
    emiMonths: "",
    kilometersDriven: "",
    fuelType: "petrol",
    transmission: "manual",
    ownerNumber: "1",
    registrationNumber: "",
    registrationState: "",
    insuranceValidUntil: "",
    color: "",
    images: [],
    documents: [],
    features: [],
    condition: "good",
    isNegotiable: false,
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    isActive: true,
    isFeatured: false,
    userId: userId,
    role: userRole,
  });

  // Update formData when userId or userRole changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      userId: userId,
      role: userRole,
    }));
  }, [userId, userRole]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!userId) return;

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId);
        queryParams.append('role', userRole);

        const response = await fetch(`/api/admin/cars-bikes?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          queryClient.setQueryData(["/api/admin/cars-bikes", userId, userRole], data);
        }
      } catch (error) {
        console.error('Error fetching listings in useEffect:', error);
      }
    };

    fetchListings();
  }, [userId, userRole, queryClient]);

  const { data: listings = [], isLoading } = useQuery<CarBike[]>({
    queryKey: ["/api/admin/cars-bikes", userId, userRole],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (userRole) params.append('role', userRole);

      const response = await fetch(`/api/admin/cars-bikes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!data.userId) {
        throw new Error("User ID is required. Please log in again.");
      }

      const payload = {
        title: data.title,
        description: data.description || null,
        listingType: data.listingType,
        vehicleType: data.vehicleType,
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year.toString()),
        price: parseFloat(data.price.toString()),
        kilometersDriven: data.kilometersDriven ? parseInt(data.kilometersDriven.toString()) : null,
        fuelType: data.fuelType || null,
        transmission: data.transmission || null,
        ownerNumber: data.ownerNumber ? parseInt(data.ownerNumber.toString()) : null,
        registrationNumber: data.registrationNumber || null,
        registrationState: data.registrationState || null,
        insuranceValidUntil: data.insuranceValidUntil || null,
        color: data.color || null,
        images: data.images || [],
        documents: data.documents || [],
        features: data.features || [],
        condition: data.condition || null,
        isNegotiable: data.isNegotiable,
        country: data.country,
        stateProvince: data.stateProvince || null,
        city: data.city || null,
        areaName: data.areaName || null,
        fullAddress: data.fullAddress || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        userId: data.userId,
        role: data.role,
      };

      const response = await fetch("/api/admin/cars-bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create vehicle");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      if (!data.userId) {
        throw new Error("User ID is required. Please log in again.");
      }

      const payload = {
        title: data.title,
        description: data.description || null,
        listingType: data.listingType,
        vehicleType: data.vehicleType,
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year.toString()),
        price: parseFloat(data.price.toString()),
        kilometersDriven: data.kilometersDriven ? parseInt(data.kilometersDriven.toString()) : null,
        fuelType: data.fuelType || null,
        transmission: data.transmission || null,
        ownerNumber: data.ownerNumber ? parseInt(data.ownerNumber.toString()) : null,
        registrationNumber: data.registrationNumber || null,
        registrationState: data.registrationState || null,
        insuranceValidUntil: data.insuranceValidUntil || null,
        color: data.color || null,
        images: data.images || [],
        documents: data.documents || [],
        features: data.features || [],
        condition: data.condition || null,
        isNegotiable: data.isNegotiable,
        country: data.country,
        stateProvince: data.stateProvince || null,
        city: data.city || null,
        areaName: data.areaName || null,
        fullAddress: data.fullAddress || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        userId: data.userId,
        role: data.role,
      };

      const response = await fetch(`/api/admin/cars-bikes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update vehicle");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Vehicle listing deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}/toggle-active`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cars-bikes/${id}/toggle-featured`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cars-bikes"] });
      toast({ title: "Success", description: "Featured status updated successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      listingType: "sell",
      vehicleType: "car",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: "",
      emiAvailable: false,
      emiStartingFrom: "",
      emiMonths: "",
      kilometersDriven: "",
      fuelType: "petrol",
      transmission: "manual",
      ownerNumber: "1",
      registrationNumber: "",
      registrationState: "",
      insuranceValidUntil: "",
      color: "",
      images: [],
      documents: [],
      features: [],
      condition: "good",
      isNegotiable: false,
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      isActive: true,
      isFeatured: false,
      userId: userId,
      role: userRole,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: CarBike) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      listingType: item.listingType,
      vehicleType: item.vehicleType,
      brand: item.brand,
      model: item.model,
      year: item.year,
      price: item.price.toString(),
      emiAvailable: item.emiAvailable || false,
      emiStartingFrom: item.emiStartingFrom?.toString() || "",
      emiMonths: item.emiMonths?.toString() || "",
      kilometersDriven: item.kilometersDriven?.toString() || "",
      fuelType: item.fuelType || "petrol",
      transmission: item.transmission || "manual",
      ownerNumber: item.ownerNumber?.toString() || "1",
      registrationNumber: item.registrationNumber || "",
      registrationState: item.registrationState || "",
      insuranceValidUntil: item.insuranceValidUntil || "",
      color: item.color || "",
      images: item.images || [],
      documents: item.documents || [],
      features: item.features || [],
      condition: item.condition || "good",
      isNegotiable: item.isNegotiable,
      country: item.country,
      stateProvince: item.stateProvince || "",
      city: item.city || "",
      areaName: item.areaName || "",
      fullAddress: item.fullAddress || "",
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      userId: userId,
      role: userRole,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const selected = Array.from(files);
      const uploadedUrls = await uploadMultipleFiles(selected);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      if (inputEl) inputEl.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cars & Bikes</CardTitle>
            <CardDescription>Manage vehicle listings</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                <DialogDescription>Fill in the vehicle details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., 2020 Honda City VX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="listingType">Listing Type *</Label>
                    <Select value={formData.listingType} onValueChange={(value) => setFormData({ ...formData, listingType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Honda, Toyota"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., City, Activa"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="₹"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emiAvailable"
                      checked={formData.emiAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, emiAvailable: checked })}
                    />
                    <Label htmlFor="emiAvailable">EMI Available</Label>
                  </div>

                  {formData.emiAvailable && (
                    <>
                      <div>
                        <Label htmlFor="emiStartingFrom">EMI Starting From (₹)</Label>
                        <Input
                          id="emiStartingFrom"
                          type="text"
                          value={formData.emiStartingFrom}
                          onChange={(e) => setFormData({ ...formData, emiStartingFrom: e.target.value })}
                          placeholder="e.g., 15000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emiMonths">EMI Duration (Months)</Label>
                        <Select 
                          value={formData.emiMonths} 
                          onValueChange={(value) => setFormData({ ...formData, emiMonths: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select months" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="18">18 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                            <SelectItem value="48">48 Months</SelectItem>
                            <SelectItem value="60">60 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="kilometersDriven">Kilometers Driven</Label>
                    <Input
                      id="kilometersDriven"
                      type="number"
                      value={formData.kilometersDriven}
                      onChange={(e) => setFormData({ ...formData, kilometersDriven: e.target.value })}
                      placeholder="e.g., 25000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select value={formData.fuelType || ""} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select value={formData.transmission || ""} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ownerNumber">Owner Number</Label>
                    <Select value={formData.ownerNumber} onValueChange={(value) => setFormData({ ...formData, ownerNumber: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Owner</SelectItem>
                        <SelectItem value="2">2nd Owner</SelectItem>
                        <SelectItem value="3">3rd Owner</SelectItem>
                        <SelectItem value="4">4th Owner</SelectItem>
                        <SelectItem value="5">5+ Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition || ""} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs_work">Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      placeholder="e.g., MH12AB1234"
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationState">Registration State</Label>
                    <Input
                      id="registrationState"
                      value={formData.registrationState}
                      onChange={(e) => setFormData({ ...formData, registrationState: e.target.value })}
                      placeholder="e.g., Maharashtra"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g., White, Black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="insuranceValidUntil">Insurance Valid Until</Label>
                    <Input
                      id="insuranceValidUntil"
                      type="date"
                      value={formData.insuranceValidUntil}
                      onChange={(e) => setFormData({ ...formData, insuranceValidUntil: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the vehicle condition, features, etc."
                    rows={4}
                  />
                </div>
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
                    {formData.images && formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {formData.images.map((img: string, idx: number) => (
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isNegotiable}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNegotiable: checked })}
                    />
                    <Label>Price Negotiable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.listingType}</Badge>
                    </TableCell>
                    <TableCell>{item.brand} {item.model}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div>₹{item.price.toLocaleString()}</div>
                        {item.emiAvailable && (
                          <Badge className="bg-blue-600 text-xs w-fit">EMI ₹{item.emiStartingFrom}/{item.emiMonths}mo</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {item.isFeatured && <Badge variant="default">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActiveMutation.mutate(item.id)}
                      >
                        {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
