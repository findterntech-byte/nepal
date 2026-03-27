
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Edit, Trash2, Eye, Wrench } from "lucide-react";

export default function ServiceCentreWarrantyForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "warranty_service",
    centreName: "",
    centreType: "authorized",
    authorizedBrands: [] as string[],
    servicesOffered: [] as string[],
    productCategories: [] as string[],
    warrantyRepair: true,
    outOfWarrantyRepair: true,
    freeInspection: true,
    homeService: false,
    pickupDropService: false,
    sameDayService: false,
    emergencyService: false,
    genuinePartsUsed: true,
    certifiedTechnicians: true,
    warrantyPeriod: "",
    inspectionCharge: "",
    minimumServiceCharge: "",
    homeServiceCharge: "",
    pickupDropCharge: "",
    estimatedTurnaroundTime: "",
    sparesAvailable: true,
    installationService: true,
    annualMaintenanceContract: false,
    amcPrice: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    alternatePhone: "",
    whatsappNumber: "",
    websiteUrl: "",
    workingHours: "",
    workingDays: "",
    available24_7: false,
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    isActive: true,
    isFeatured: false,
  });

  if (!userId) {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserId) {
      setUserId(storedUserId);
      setUserRole(storedUserRole);
    } else {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserId(user.id);
          setUserRole(user.role);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }
  }

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["service-centre-warranty"],
    queryFn: async () => {
      const response = await fetch("/api/admin/service-centre-warranty");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/service-centre-warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-centre-warranty"] });
      toast({ title: "Success", description: "Service created successfully" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/service-centre-warranty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-centre-warranty"] });
      toast({ title: "Success", description: "Service updated successfully" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/service-centre-warranty/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-centre-warranty"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setImageError(null);
    setImages([]);
    setFormData({
      title: "",
      description: "",
      serviceType: "warranty_service",
      centreName: "",
      centreType: "authorized",
      authorizedBrands: [] as string[],
      servicesOffered: [] as string[],
      productCategories: [] as string[],
      warrantyRepair: true,
      outOfWarrantyRepair: true,
      freeInspection: true,
      homeService: false,
      pickupDropService: false,
      sameDayService: false,
      emergencyService: false,
      genuinePartsUsed: true,
      certifiedTechnicians: true,
      warrantyPeriod: "",
      inspectionCharge: "",
      minimumServiceCharge: "",
      homeServiceCharge: "",
      pickupDropCharge: "",
      estimatedTurnaroundTime: "",
      sparesAvailable: true,
      installationService: true,
      annualMaintenanceContract: false,
      amcPrice: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      alternatePhone: "",
      whatsappNumber: "",
      websiteUrl: "",
      workingHours: "",
      workingDays: "",
      available24_7: false,
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      isActive: true,
      isFeatured: false,
    });
  };

  const handleEdit = (service: any) => {
    const { images: serviceImages, ...rest } = service || {};
    setEditingService(service);
    setFormData(rest);
    setImages(Array.isArray(serviceImages) ? serviceImages : []);
    setImageError(null);
    setIsDialogOpen(true);
  };

  const uploadMultipleImages = async (files: File[]) => {
    if (files.length === 0) return [] as string[];
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const res = await fetch('/api/admin/upload-multiple', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    const urls = Array.isArray(data?.files) ? data.files.map((f: any) => f?.url).filter(Boolean) : [];
    return urls as string[];
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    const accepted: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!allowed.includes(f.type)) { setImageError('Only JPG, PNG, WEBP and GIF allowed'); continue; }
      if (f.size > maxSize) { setImageError('Each image must be <= 5MB'); continue; }
      accepted.push(f);
    }
    if (accepted.length === 0) return;
    setUploadingImages(true);
    try {
      const uploadedUrls = await uploadMultipleImages(accepted);
      setImages((prev) => [...prev, ...uploadedUrls].slice(0, 10));
      setImageError(null);
    } catch (e) {
      console.error(e);
      setImageError('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); void processFiles(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
  const openFileDialog = () => fileInputRef.current?.click();
  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Error",
        description: "User not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...formData,
      images,
      userId,
      role: userRole || 'user',
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Centre / Warranty</h2>
          <p className="text-muted-foreground">Manage service centres and warranty providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Service Centre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Service Title *</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Centre Name *</Label>
                    <Input value={formData.centreName} onChange={(e) => setFormData({ ...formData, centreName: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warranty_service">Warranty Service</SelectItem>
                        <SelectItem value="repair_service">Repair Service</SelectItem>
                        <SelectItem value="authorized_service">Authorized Service</SelectItem>
                        <SelectItem value="multi_brand">Multi Brand Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                  </div>
                  <div className="col-span-2">
                    <Label>Images</Label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`mt-2 border-2 rounded-md p-4 flex items-center justify-center ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'}`}
                    >
                      <div className="text-center">
                        <p className="mb-2">Drag & drop images here, or <button type="button" onClick={openFileDialog} className="underline">select images</button></p>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => processFiles(e.target.files)} className="hidden" />
                        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                        {images.length > 0 && (
                          <div className="mt-3 grid grid-cols-5 gap-2">
                            {images.map((src, idx) => (
                              <div key={idx} className="relative">
                                <img src={src} alt={`preview-${idx}`} className="w-24 h-24 rounded" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.warrantyRepair} onCheckedChange={(checked) => setFormData({ ...formData, warrantyRepair: checked })} />
                    <Label>Warranty Repair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.freeInspection} onCheckedChange={(checked) => setFormData({ ...formData, freeInspection: checked })} />
                    <Label>Free Inspection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.homeService} onCheckedChange={(checked) => setFormData({ ...formData, homeService: checked })} />
                    <Label>Home Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.genuinePartsUsed} onCheckedChange={(checked) => setFormData({ ...formData, genuinePartsUsed: checked })} />
                    <Label>Genuine Parts</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Person *</Label>
                    <Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Contact Phone *</Label>
                    <Input value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div>
                    <Label>Full Address *</Label>
                    <Input value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{editingService ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {services.map((service: any) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-4">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.centreName}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{service.serviceType.replace('_', ' ')}</Badge>
                        {service.freeInspection && <Badge className="bg-green-600">Free Inspection</Badge>}
                        {service.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setViewingService(service)}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(service.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
