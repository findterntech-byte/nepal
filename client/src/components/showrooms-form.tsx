import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
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

interface Showroom {
  id: string;
  title: string;
  description?: string;
  showroomName: string;
  authorizedBrand?: string;
  vehicleType: string;
  vehicleDetails?: Record<string, any>;
  year?: number;
  price: number;
  priceType?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  registrationNumber?: string;
  registrationYear?: number;
  ownerCount?: number;
  warrantyAvailable: boolean;
  warrantyDetails?: string;
  serviceHistory: boolean;
  certificationDetails?: string;
  images?: string[];
  documents?: string[];
  features?: string[];
  isCertified: boolean;
  inspectionReport?: string;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  showroomContact?: string;
  showroomEmail?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  role?: string;
}

export function ShowroomsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Showroom | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const userId = user?.id;
  const userRole = user?.role;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    showroomName: "",
    authorizedBrand: "",
    vehicleType: "car",
    year: new Date().getFullYear(),
    price: "",
    priceType: "fixed",
    mileage: "",
    fuelType: "",
    transmission: "",
    color: "",
    registrationNumber: "",
    registrationYear: new Date().getFullYear(),
    ownerCount: "",
    warrantyAvailable: false,
    warrantyDetails: "",
    serviceHistory: false,
    certificationDetails: "",
    isCertified: true,
    inspectionReport: "",
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    showroomContact: "",
    showroomEmail: "",
    isActive: true,
    isFeatured: false,
    images: [],
    userId: userId,
    role: userRole,
  });

  const { data: showroomsList = [], isLoading } = useQuery<Showroom[]>({
    queryKey: ["/api/admin/showrooms"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/admin/showrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sellerId: userId,
          role: userRole,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create showroom");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/showrooms"] });
      toast({ title: "Success", description: "Showroom created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await fetch(`/api/admin/showrooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update showroom");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/showrooms"] });
      toast({ title: "Success", description: "Showroom updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/showrooms/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete showroom");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/showrooms"] });
      toast({ title: "Success", description: "Showroom deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/showrooms/${id}/toggle-active`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to toggle active status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/showrooms"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/showrooms/${id}/toggle-featured`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to toggle featured status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/showrooms"] });
      toast({ title: "Success", description: "Featured status updated successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      showroomName: "",
      authorizedBrand: "",
      vehicleType: "car",
      year: new Date().getFullYear(),
      price: "",
      priceType: "fixed",
      mileage: "",
      fuelType: "",
      transmission: "",
      color: "",
      registrationNumber: "",
      registrationYear: new Date().getFullYear(),
      ownerCount: "",
      warrantyAvailable: false,
      warrantyDetails: "",
      serviceHistory: false,
      certificationDetails: "",
      isCertified: true,
      inspectionReport: "",
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      showroomContact: "",
      showroomEmail: "",
      isActive: true,
      isFeatured: false,
      images: [],
      userId: userId,
      role: userRole,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: Showroom) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      showroomName: item.showroomName,
      authorizedBrand: item.authorizedBrand || "",
      vehicleType: item.vehicleType,
      year: item.year || new Date().getFullYear(),
      price: item.price.toString(),
      priceType: item.priceType || "fixed",
      mileage: item.mileage?.toString() || "",
      fuelType: item.fuelType || "",
      transmission: item.transmission || "",
      color: item.color || "",
      registrationNumber: item.registrationNumber || "",
      registrationYear: item.registrationYear || new Date().getFullYear(),
      ownerCount: item.ownerCount?.toString() || "",
      warrantyAvailable: item.warrantyAvailable,
      warrantyDetails: item.warrantyDetails || "",
      serviceHistory: item.serviceHistory,
      certificationDetails: item.certificationDetails || "",
      isCertified: item.isCertified,
      inspectionReport: item.inspectionReport || "",
      country: item.country,
      stateProvince: item.stateProvince || "",
      city: item.city || "",
      areaName: item.areaName || "",
      fullAddress: item.fullAddress || "",
      showroomContact: item.showroomContact || "",
      showroomEmail: item.showroomEmail || "",
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      images: item.images || [],
      userId: item.userId,
      role: item.role,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('files', f));
      const res = await fetch('/api/admin/upload-multiple', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const uploadedUrls = Array.isArray(data?.files)
        ? data.files.map((f: any) => f?.url).filter(Boolean)
        : [];

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
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert empty strings to null for numeric fields
    const sanitizedData = {
      ...formData,
      year: formData.year ? parseInt(formData.year.toString()) : null,
      mileage: formData.mileage ? parseInt(formData.mileage.toString()) : null,
      registrationYear: formData.registrationYear ? parseInt(formData.registrationYear.toString()) : null,
      ownerCount: formData.ownerCount ? parseInt(formData.ownerCount.toString()) : null,
      price: parseFloat(formData.price.toString()),
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: sanitizedData });
    } else {
      createMutation.mutate(sanitizedData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Showrooms (Authorized Second-hand)</CardTitle>
              <CardDescription>Manage authorized second-hand vehicle showrooms</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Showroom
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Showroom" : "Add New Showroom"}</DialogTitle>
                  <DialogDescription>Fill in the showroom details below</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="showroomName">Showroom Name *</Label>
                      <Input
                        id="showroomName"
                        value={formData.showroomName}
                        onChange={(e) => setFormData({ ...formData, showroomName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="authorizedBrand">Authorized Brand</Label>
                      <Input
                        id="authorizedBrand"
                        value={formData.authorizedBrand}
                        onChange={(e) => setFormData({ ...formData, authorizedBrand: e.target.value })}
                      />
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
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="priceType">Price Type</Label>
                      <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="negotiable">Negotiable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mileage">Mileage (km)</Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="fuelType">Fuel Type</Label>
                      <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
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
                      <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
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
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="ownerCount">Owner Count</Label>
                      <Input
                        id="ownerCount"
                        type="number"
                        value={formData.ownerCount}
                        onChange={(e) => setFormData({ ...formData, ownerCount: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="showroomContact">Showroom Contact</Label>
                      <Input
                        id="showroomContact"
                        value={formData.showroomContact}
                        onChange={(e) => setFormData({ ...formData, showroomContact: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="showroomEmail">Showroom Email</Label>
                      <Input
                        id="showroomEmail"
                        type="email"
                        value={formData.showroomEmail}
                        onChange={(e) => setFormData({ ...formData, showroomEmail: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="fullAddress">Full Address</Label>
                      <Input
                        id="fullAddress"
                        value={formData.fullAddress}
                        onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.warrantyAvailable}
                        onCheckedChange={(checked) => setFormData({ ...formData, warrantyAvailable: checked })}
                      />
                      <Label>Warranty Available</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.serviceHistory}
                        onCheckedChange={(checked) => setFormData({ ...formData, serviceHistory: checked })}
                      />
                      <Label>Service History Available</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isCertified}
                        onCheckedChange={(checked) => setFormData({ ...formData, isCertified: checked })}
                      />
                      <Label>Certified</Label>
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

                    <div className="md:col-span-2">
                      <Label htmlFor="images">Images</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                      {formData.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img src={image} alt={`Showroom image ${index + 1}`} className="w-24 h-24  rounded" />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => removeImage(index)}
                                type="button"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {uploadingImages && <p className="text-sm text-gray-500">Uploading images...</p>}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingItem ? "Update" : "Create"} Showroom
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Showroom</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showroomsList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.showroomName}</TableCell>
                    <TableCell>{item.vehicleType}</TableCell>
                    <TableCell>₹{parseFloat(item.price.toString()).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {item.isFeatured && <Badge variant="outline">Featured</Badge>}
                        {item.isCertified && <Badge className="bg-green-500">Certified</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleActiveMutation.mutate(item.id)}
                        >
                          {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
    </div>
  );
} 