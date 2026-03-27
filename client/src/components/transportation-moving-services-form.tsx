import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Eye, EyeOff, MapPin, Phone, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransportationService {
  id: string;
  title: string;
  description?: string;
  serviceType: string;
  companyName: string;
  vehicleType?: string;
  vehicleCapacity?: string;
  priceType: string;
  basePrice: number | undefined;
  pricePerKm?: number | undefined;
  pricePerHour?: number | undefined;
  minimumCharge?: number | undefined;
  availableVehicles?: string[];
  crewSize?: number | undefined;
  insuranceIncluded: boolean;
  insuranceCoverage?: string;
  packingServiceAvailable: boolean;
  packingCharges?: number | undefined;
  loadingUnloadingIncluded: boolean;
  storageAvailable: boolean;
  storagePricePerDay?: number | undefined;
  serviceAreas?: string[];
  operatingHours?: string;
  advanceBookingRequired: boolean;
  minimumBookingHours?: number | undefined;
  sameDayService: boolean;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  serviceRadiusKm?: number | undefined;
  contactPerson?: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappNumber?: string;
  servicesOffered?: string[];
  specialItemsHandled?: string[];
  images?: string[];
  documents?: string[];
  termsAndConditions?: string;
  cancellationPolicy?: string;
  paymentMethods?: string[];
  advancePaymentPercentage?: number | undefined;
  isVerified: boolean;
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount: number;
  completedJobs: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
   userId: string;
  role: string;
}

export function TransportationMovingServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransportationService | null>(null);
  const [viewingItem, setViewingItem] = useState<TransportationService | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    serviceType: "local_moving",
    companyName: "",
    vehicleType: "",
    vehicleCapacity: "",
    priceType: "per_trip",
    basePrice: undefined,
    pricePerKm: undefined,
    pricePerHour: undefined,
    minimumCharge: undefined,
    crewSize: undefined,
    insuranceIncluded: false,
    insuranceCoverage: "",
    packingServiceAvailable: false,
    packingCharges: undefined,
    loadingUnloadingIncluded: true,
    storageAvailable: false,
    storagePricePerDay: undefined,
    operatingHours: "",
    advanceBookingRequired: true,
    minimumBookingHours: undefined,
    sameDayService: false,
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    serviceRadiusKm: undefined,
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    whatsappNumber: "",
    termsAndConditions: "",
    cancellationPolicy: "",
    advancePaymentPercentage: undefined,
    images: [],
    isActive: true,
    isFeatured: false,
    userId: userId,
    role: userRole,
  });

  useEffect(() => {
    const fetchServices = async () => {
      if (!userId) return;

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId);
        queryParams.append('role', userRole || 'user');

        const response = await fetch(`/api/admin/transportation-moving-services?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          queryClient.setQueryData(["/api/admin/transportation-moving-services", userId, userRole], data);
        }
      } catch (error) {
        console.error('Error fetching services in useEffect:', error);
      }
    };

    fetchServices();
  }, [userId, userRole, queryClient]);

  const { data: services = [], isLoading } = useQuery<TransportationService[]>({
    queryKey: ["/api/admin/transportation-moving-services", userId, userRole],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (userRole) params.append('role', userRole);

      const response = await fetch(`/api/admin/transportation-moving-services?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const response = await fetch("/api/admin/transportation-moving-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerId: userData?.id || userId,
          userId: userData?.id || userId,
          role: userData?.role || userRole || 'user',
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transportation-moving-services"] });
      toast({ title: "Success", description: "Service created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const response = await fetch(`/api/admin/transportation-moving-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: userData?.id || userId,
          role: userData?.role || userRole || 'user',
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transportation-moving-services"] });
      toast({ title: "Success", description: "Service updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/transportation-moving-services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transportation-moving-services"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/transportation-moving-services/${id}/toggle-active`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to toggle active status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transportation-moving-services"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/transportation-moving-services/${id}/toggle-featured`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to toggle featured status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transportation-moving-services"] });
      toast({ title: "Success", description: "Featured status updated successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      serviceType: "local_moving",
      companyName: "",
      vehicleType: "",
      vehicleCapacity: "",
      priceType: "per_trip",
      basePrice: undefined,
      pricePerKm: undefined,
      pricePerHour: undefined,
      minimumCharge: undefined,
      crewSize: undefined,
      insuranceIncluded: false,
      insuranceCoverage: "",
      packingServiceAvailable: false,
      packingCharges: undefined,
      loadingUnloadingIncluded: true,
      storageAvailable: false,
      storagePricePerDay: undefined,
      operatingHours: "",
      advanceBookingRequired: true,
      minimumBookingHours: undefined,
      sameDayService: false,
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      serviceRadiusKm: undefined,
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      whatsappNumber: "",
      termsAndConditions: "",
      cancellationPolicy: "",
      advancePaymentPercentage: undefined,
      images: [],
      isActive: true,
      isFeatured: false,
      userId: userId,
      role: userRole,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: TransportationService) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      serviceType: item.serviceType,
      companyName: item.companyName,
      vehicleType: item.vehicleType || "",
      vehicleCapacity: item.vehicleCapacity || "",
      priceType: item.priceType,
      basePrice: item.basePrice,
      pricePerKm: item.pricePerKm,
      pricePerHour: item.pricePerHour,
      minimumCharge: item.minimumCharge,
      crewSize: item.crewSize,
      insuranceIncluded: item.insuranceIncluded,
      insuranceCoverage: item.insuranceCoverage || "",
      packingServiceAvailable: item.packingServiceAvailable,
      packingCharges: item.packingCharges,
      loadingUnloadingIncluded: item.loadingUnloadingIncluded,
      storageAvailable: item.storageAvailable,
      storagePricePerDay: item.storagePricePerDay,
      operatingHours: item.operatingHours || "",
      advanceBookingRequired: item.advanceBookingRequired,
      minimumBookingHours: item.minimumBookingHours,
      sameDayService: item.sameDayService,
      country: item.country,
      stateProvince: item.stateProvince || "",
      city: item.city || "",
      areaName: item.areaName || "",
      fullAddress: item.fullAddress || "",
      serviceRadiusKm: item.serviceRadiusKm,
      contactPerson: item.contactPerson || "",
      contactPhone: item.contactPhone,
      contactEmail: item.contactEmail || "",
      whatsappNumber: item.whatsappNumber || "",
      termsAndConditions: item.termsAndConditions || "",
      cancellationPolicy: item.cancellationPolicy || "",
      advancePaymentPercentage: item.advancePaymentPercentage,
      images: item.images || [],
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      userId: userId,
      role: userRole,
    });
    setIsDialogOpen(true);
  };

  const handleView = (item: TransportationService) => {
    setViewingItem(item);
    setViewDialogOpen(true);
  };

  const uploadMultipleImages = async (fileList: FileList) => {
    const files = Array.from(fileList);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedUrls = await uploadMultipleImages(files);
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: [...(prevFormData.images || []), ...uploadedUrls],
      }));
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast({ title: "Error", description: error?.message || 'Failed to upload images', variant: "destructive" });
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert empty strings to null for numeric fields
      const formattedData = {
        ...formData,
        userId: userId,
        role: userRole,
        ownerId: userId,
        basePrice: formData.basePrice === "" || formData.basePrice === undefined || formData.basePrice === null ? null : parseFloat(String(formData.basePrice)),
        pricePerKm: formData.pricePerKm === "" || formData.pricePerKm === undefined || formData.pricePerKm === null ? null : parseFloat(String(formData.pricePerKm)),
        pricePerHour: formData.pricePerHour === "" || formData.pricePerHour === undefined || formData.pricePerHour === null ? null : parseFloat(String(formData.pricePerHour)),
        minimumCharge: formData.minimumCharge === "" || formData.minimumCharge === undefined || formData.minimumCharge === null ? null : parseFloat(String(formData.minimumCharge)),
        crewSize: formData.crewSize === "" || formData.crewSize === undefined || formData.crewSize === null ? null : parseInt(String(formData.crewSize)),
        packingCharges: formData.packingCharges === "" || formData.packingCharges === undefined || formData.packingCharges === null ? null : parseFloat(String(formData.packingCharges)),
        storagePricePerDay: formData.storagePricePerDay === "" || formData.storagePricePerDay === undefined || formData.storagePricePerDay === null ? null : parseFloat(String(formData.storagePricePerDay)),
        serviceRadiusKm: formData.serviceRadiusKm === "" || formData.serviceRadiusKm === undefined || formData.serviceRadiusKm === null ? null : parseInt(String(formData.serviceRadiusKm)),
        minimumBookingHours: formData.minimumBookingHours === "" || formData.minimumBookingHours === undefined || formData.minimumBookingHours === null ? null : parseInt(String(formData.minimumBookingHours)),
        advancePaymentPercentage: formData.advancePaymentPercentage === "" || formData.advancePaymentPercentage === undefined || formData.advancePaymentPercentage === null ? null : parseFloat(String(formData.advancePaymentPercentage)),
      };

      const url = editingItem?.id
        ? `/api/admin/transportation-moving-services/${editingItem.id}`
        : '/api/admin/transportation-moving-services';

      const method = editingItem?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save service");
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/transportation-moving-services"] });
      toast({ title: "Success", description: editingItem ? "Service updated successfully" : "Service created successfully" });
      setIsDialogOpen(false);
      resetForm();

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Transportation & Moving Services</h3>
            <p className="text-sm text-muted-foreground">Manage transportation and moving service listings</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(services) && services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{service.serviceType.replace('_', ' ')}</Badge>
                      {service.isVerified && <Badge className="bg-green-500">Verified</Badge>}
                      {service.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(service)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(service)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-lg text-primary">₹{service.basePrice}/{service.priceType.replace('_', ' ')}</span>
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                      <span className="text-muted-foreground">({service.reviewCount})</span>
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{service.companyName}</p>
                  {service.city && (
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{service.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{service.contactPhone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button variant={service.isActive ? "outline" : "default"} size="sm" className="flex-1" onClick={() => toggleActiveMutation.mutate(service.id)}>
                  {service.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button variant={service.isFeatured ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => toggleFeaturedMutation.mutate(service.id)}>
                  {service.isFeatured ? "Unfeature" : "Feature"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {(!services || services.length === 0) && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">No transportation services found</div>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Transportation/Moving Service</DialogTitle>
            <DialogDescription>Fill in the service details below</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local_moving">Local Moving</SelectItem>
                        <SelectItem value="interstate_moving">Interstate Moving</SelectItem>
                        <SelectItem value="international_moving">International Moving</SelectItem>
                        <SelectItem value="vehicle_transport">Vehicle Transport</SelectItem>
                        <SelectItem value="office_relocation">Office Relocation</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="packing">Packing Services</SelectItem>
                        <SelectItem value="specialized_moving">Specialized Moving</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Input id="vehicleType" value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} placeholder="e.g., Truck, Van, Container" />
                  </div>
                  <div>
                    <Label htmlFor="vehicleCapacity">Vehicle Capacity</Label>
                    <Input id="vehicleCapacity" value={formData.vehicleCapacity} onChange={(e) => setFormData({ ...formData, vehicleCapacity: e.target.value })} placeholder="e.g., 5 tons, 20 cubic meters" />
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
                    <Label htmlFor="priceType">Price Type *</Label>
                    <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per_trip">Per Trip</SelectItem>
                        <SelectItem value="per_hour">Per Hour</SelectItem>
                        <SelectItem value="per_km">Per Kilometer</SelectItem>
                        <SelectItem value="flat_rate">Flat Rate</SelectItem>
                        <SelectItem value="custom">Custom Quote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="basePrice">Base Price *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      value={formData.basePrice ?? ""}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerKm">Price Per KM</Label>
                    <Input
                      id="pricePerKm"
                      type="number"
                      value={formData.pricePerKm ?? ""}
                      onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerHour">Price Per Hour</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      value={formData.pricePerHour ?? ""}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumCharge">Minimum Charge</Label>
                    <Input
                      id="minimumCharge"
                      type="number"
                      value={formData.minimumCharge ?? ""}
                      onChange={(e) => setFormData({ ...formData, minimumCharge: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="advancePaymentPercentage">Advance Payment %</Label>
                    <Input
                      id="advancePaymentPercentage"
                      type="number"
                      value={formData.advancePaymentPercentage ?? ""}
                      onChange={(e) => setFormData({ ...formData, advancePaymentPercentage: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crewSize">Crew Size</Label>
                    <Input
                      id="crewSize"
                      type="number"
                      value={formData.crewSize ?? ""}
                      onChange={(e) => setFormData({ ...formData, crewSize: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packingCharges">Packing Charges</Label>
                    <Input
                      id="packingCharges"
                      type="number"
                      value={formData.packingCharges ?? ""}
                      onChange={(e) => setFormData({ ...formData, packingCharges: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storagePricePerDay">Storage Price Per Day</Label>
                    <Input
                      id="storagePricePerDay"
                      type="number"
                      value={formData.storagePricePerDay ?? ""}
                      onChange={(e) => setFormData({ ...formData, storagePricePerDay: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceCoverage">Insurance Coverage</Label>
                    <Input id="insuranceCoverage" value={formData.insuranceCoverage} onChange={(e) => setFormData({ ...formData, insuranceCoverage: e.target.value })} placeholder="e.g., Up to ₹5 lakhs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.insuranceIncluded} onCheckedChange={(checked) => setFormData({ ...formData, insuranceIncluded: checked })} />
                    <Label>Insurance Included</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.packingServiceAvailable} onCheckedChange={(checked) => setFormData({ ...formData, packingServiceAvailable: checked })} />
                    <Label>Packing Service Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.loadingUnloadingIncluded} onCheckedChange={(checked) => setFormData({ ...formData, loadingUnloadingIncluded: checked })} />
                    <Label>Loading/Unloading Included</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.storageAvailable} onCheckedChange={(checked) => setFormData({ ...formData, storageAvailable: checked })} />
                    <Label>Storage Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.advanceBookingRequired} onCheckedChange={(checked) => setFormData({ ...formData, advanceBookingRequired: checked })} />
                    <Label>Advance Booking Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.sameDayService} onCheckedChange={(checked) => setFormData({ ...formData, sameDayService: checked })} />
                    <Label>Same Day Service</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Input id="stateProvince" value={formData.stateProvince} onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="areaName">Area</Label>
                    <Input id="areaName" value={formData.areaName} onChange={(e) => setFormData({ ...formData, areaName: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="fullAddress">Full Address</Label>
                    <Input id="fullAddress" value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="serviceRadiusKm">Service Radius (km)</Label>
                    <Input
                      id="serviceRadiusKm"
                      type="number"
                      value={formData.serviceRadiusKm ?? ""}
                      onChange={(e) => setFormData({ ...formData, serviceRadiusKm: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumBookingHours">Minimum Booking Hours</Label>
                    <Input
                      id="minimumBookingHours"
                      type="number"
                      value={formData.minimumBookingHours ?? ""}
                      onChange={(e) => setFormData({ ...formData, minimumBookingHours: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="operatingHours">Operating Hours</Label>
                    <Input id="operatingHours" value={formData.operatingHours} onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })} placeholder="e.g., Mon-Sat 9AM-6PM" />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                  <Textarea id="termsAndConditions" value={formData.termsAndConditions} onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <Textarea id="cancellationPolicy" value={formData.cancellationPolicy} onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })} rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                  {uploadingImages && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                </div>
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
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
                          ×
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
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.isFeatured} onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })} />
                    <Label>Featured</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? (editingItem ? "Updating..." : "Creating...") : (editingItem ? "Update Service" : "Create Service")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingItem?.title}</DialogTitle>
            <DialogDescription>{viewingItem?.companyName}</DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingItem.serviceType.replace('_', ' ')}</Badge>
                {viewingItem.isVerified && <Badge className="bg-green-500">Verified</Badge>}
                {viewingItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                {viewingItem.sameDayService && <Badge variant="outline">Same Day Service</Badge>}
              </div>

              {viewingItem.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingItem.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <p>Base: ₹{viewingItem.basePrice} / {viewingItem.priceType.replace('_', ' ')}</p>
                  {viewingItem.pricePerKm && <p>Per KM: ₹{viewingItem.pricePerKm}</p>}
                  {viewingItem.minimumCharge && <p>Minimum: ₹{viewingItem.minimumCharge}</p>}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <p>{viewingItem.contactPhone}</p>
                  {viewingItem.contactEmail && <p>{viewingItem.contactEmail}</p>}
                </div>
              </div>

              {viewingItem.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <p className="text-muted-foreground">{viewingItem.fullAddress}</p>
                </div>
              )}

              {viewingItem.images && viewingItem.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {viewingItem.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Service image ${idx + 1}`} className="w-full h-24  rounded" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}