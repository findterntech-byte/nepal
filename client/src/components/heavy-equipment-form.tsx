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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface HeavyEquipment {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  equipmentType: string;
  category: string;
  brand?: string;
  model?: string;
  year?: number;
  price: number;
  priceType?: string;
  condition?: string;
  hoursUsed?: number;
  serialNumber?: string;
  specifications?: Record<string, any>;
  images?: string[];
  documents?: string[];
  features?: string[];
  maintenanceHistory?: string;
  warrantyInfo?: string;
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
  userId: string; // Added
  role: string; // Added
}

export function HeavyEquipmentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeavyEquipment | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to control dialog visibility


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

  const userRole = localUser?.role || user?.role || 'admin';
  useEffect(() => {
    const fetchListings = async () => {


      try {
        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId);
        queryParams.append('role', userRole || 'admin');

        const response = await fetch(`/api/admin/second-hand-cars-bikes?${queryParams.toString()}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched listings in useEffect:', data);
          // Optionally update React Query cache
          queryClient.setQueryData(["/api/admin/second-hand-cars-bikes", userId, userRole], data);
        }
      } catch (error) {
        console.error('Error fetching listings in useEffect:', error);
      }
    };

    fetchListings();
  }, [userId, userRole, queryClient]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "sale",
    equipmentType: "excavator",
    category: "construction",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    priceType: "total",
    condition: "used",
    hoursUsed: "",
    serialNumber: "",
    specifications: {} as Record<string, string>,
    images: [] as string[],
    documents: [] as string[],
    features: [] as string[],
    maintenanceHistory: "",
    warrantyInfo: "",
    isNegotiable: false,
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    isActive: true,
    isFeatured: false,
    userId: userId, // Initialize with userId
    role: userRole, // Initialize with role
  });

  const { data: equipment = [], isLoading } = useQuery<HeavyEquipment[]>({
    queryKey: ["/api/admin/heavy-equipment", userId, userRole],
    queryFn: async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return [];

      const userData = JSON.parse(storedUser);
      const queryParams = new URLSearchParams();

      // Always send userId
      if (userData.id) {
        queryParams.append('userId', userData.id);
      }
      // Always send role
      queryParams.append('role', userData.role || 'user');

      const response = await fetch(`/api/admin/heavy-equipment?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch equipment");
      const data = await response.json();
      console.log('Fetched equipment:', data);
      return Array.isArray(data) ? data : [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;

      // Ensure userId and role are not null
      const finalUserId = userData?.id || userId;
      const finalUserRole = userData?.role || userRole || 'user';

      if (!finalUserId) {
        throw new Error("User ID is required. Please log in again.");
      }

      const response = await fetch("/api/admin/heavy-equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sellerId: finalUserId,
          userId: finalUserId,
          role: finalUserRole,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create equipment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heavy-equipment"] });
      toast({ title: "Success", description: "Equipment created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;

      // Ensure userId and role are not null
      const finalUserId = userData?.id || userId;
      const finalUserRole = userData?.role || userRole || 'user';

      if (!finalUserId) {
        throw new Error("User ID is required. Please log in again.");
      }

      const response = await fetch(`/api/admin/heavy-equipment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sellerId: finalUserId,
          userId: finalUserId,
          role: finalUserRole,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update equipment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heavy-equipment"] });
      toast({ title: "Success", description: "Equipment updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/heavy-equipment/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete equipment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heavy-equipment"] });
      toast({ title: "Success", description: "Equipment deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/heavy-equipment/${id}/toggle-active`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to toggle active status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heavy-equipment"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/heavy-equipment/${id}/toggle-featured`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to toggle featured status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heavy-equipment"] });
      toast({ title: "Success", description: "Featured status updated successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      listingType: "sale",
      equipmentType: "excavator",
      category: "construction",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: "",
      priceType: "total",
      condition: "used",
      hoursUsed: "",
      serialNumber: "",
      specifications: {},
      images: [],
      documents: [],
      features: [],
      maintenanceHistory: "",
      warrantyInfo: "",
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

  const handleEdit = (item: HeavyEquipment) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      listingType: item.listingType,
      equipmentType: item.equipmentType,
      category: item.category,
      brand: item.brand || "",
      model: item.model || "",
      year: item.year || new Date().getFullYear(),
      price: item.price.toString(),
      priceType: item.priceType || "total",
      condition: item.condition || "used",
      hoursUsed: item.hoursUsed?.toString() || "",
      serialNumber: item.serialNumber || "",
      specifications: item.specifications || {},
      images: item.images || [],
      documents: item.documents || [],
      features: item.features || [],
      maintenanceHistory: item.maintenanceHistory || "",
      warrantyInfo: item.warrantyInfo || "",
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
    setShowForm(true); // Ensure dialog opens to form if editing
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
      const urls = Array.isArray(data?.files)
        ? data.files
            .map((x: any) => x?.url)
            .filter((u: any) => typeof u === 'string' && u.length > 0)
        : [];
      return urls;
    };

    try {
      const fileArr = Array.from(files);
      const newUrls = await uploadMultipleFiles(fileArr);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));
      toast({
        title: 'Success',
        description: `${newUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Heavy Equipment Listings</CardTitle>
              <CardDescription>Manage your heavy equipment inventory</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                resetForm(); // Reset form when dialog is closed
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setShowForm(true); // Show the form when adding new
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
                  <DialogDescription>Fill in the equipment details below</DialogDescription>
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
                      <Label htmlFor="listingType">Listing Type *</Label>
                      <Select value={formData.listingType} onValueChange={(value) => setFormData({ ...formData, listingType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="lease">For Lease</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="equipmentType">Equipment Type *</Label>
                      <Select value={formData.equipmentType} onValueChange={(value) => setFormData({ ...formData, equipmentType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excavator">Excavator</SelectItem>
                          <SelectItem value="bulldozer">Bulldozer</SelectItem>
                          <SelectItem value="crane">Crane</SelectItem>
                          <SelectItem value="loader">Loader</SelectItem>
                          <SelectItem value="grader">Grader</SelectItem>
                          <SelectItem value="forklift">Forklift</SelectItem>
                          <SelectItem value="compactor">Compactor</SelectItem>
                          <SelectItem value="dump-truck">Dump Truck</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="mining">Mining</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="material-handling">Material Handling</SelectItem>
                          <SelectItem value="earthmoving">Earthmoving</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
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
                        type="text"
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
                          <SelectItem value="total">Total</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="hoursUsed">Hours Used</Label>
                      <Input
                        id="hoursUsed"
                        type="number"
                        value={formData.hoursUsed}
                        onChange={(e) => setFormData({ ...formData, hoursUsed: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="serialNumber">Serial Number</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
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

                  <div>
                    <Label htmlFor="images">Images</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                      {formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img src={imageUrl} alt={`Equipment ${index}`} className="w-20 h-20  rounded-md" />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {uploadingImages && <p>Uploading images...</p>}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingItem ? "Update" : "Create"} Equipment
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
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.equipmentType}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{parseFloat(item.price.toString()).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {item.isFeatured && <Badge variant="outline">Featured</Badge>}
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