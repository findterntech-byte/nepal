import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Building, MapPin, Phone, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventDecorationService {
  id: string;
  title: string;
  description?: string;
  serviceType: string;
  venueName?: string;
  venueType?: string;
  capacity?: number;
  basePrice: number;
  priceType: string;
  contactPerson: string;
  contactPhone: string;
  city?: string;
  fullAddress: string;
  cateringAvailable: boolean;
  decorationIncluded: boolean;
  parkingAvailable: boolean;
  acAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export function EventDecorationServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventDecorationService | null>(null);
  const [viewingItem, setViewingItem] = useState<EventDecorationService | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get userId and role from localStorage
    let storedUserId = localStorage.getItem('userId');
    let storedUserRole = localStorage.getItem('userRole');

    // If not found, try getting from user object in localStorage
    if (!storedUserId) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          storedUserId = user.id;
          storedUserRole = user.role;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }

    setUserId(storedUserId);
    setUserRole(storedUserRole);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "marriage_hall",
    venueName: "",
    venueType: "indoor",
    capacity: "",
    capacitySeating: "",
    capacityStanding: "",
    hallArea: "",
    basePrice: "",
    priceType: "per_event",
    pricePerHour: "",
    pricePerDay: "",
    minimumBookingHours: "",
    minimumCharge: "",
    securityDeposit: "",
    cateringAvailable: false,
    cateringIncluded: false,
    cateringPricePerPlate: "",
    decorationIncluded: false,
    decorationCharges: "",
    djSoundAvailable: false,
    djSoundCharges: "",
    lightingCharges: "",
    parkingAvailable: false,
    parkingCapacity: "",
    parkingCharges: "",
    acAvailable: false,
    powerBackup: false,
    greenRooms: "",
    washrooms: "",
    kitchenFacility: false,
    photographyAllowed: true,
    outsideCateringAllowed: false,
    businessName: "",
    ownerName: "",
    experienceYears: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    whatsappNumber: "",
    country: "India",
    stateProvince: "",
    city: "",
    areaName: "",
    fullAddress: "",
    workingHours: "",
    advanceBookingRequired: true,
    minimumAdvanceBookingDays: "7",
    advancePaymentRequired: true,
    advancePaymentPercentage: "",
    isActive: true,
    isFeatured: false,
    images: [] as string[],
    teamSize: "",
    plannerCharges: "",
    setupCharges: "",
    quantity: "",
    minimumOrderQuantity: "",
    offSeasonDiscount: "",
    peakSeasonCharges: "",
  });

  const { data: services = [], isLoading } = useQuery<EventDecorationService[]>({
    queryKey: ["/api/admin/event-decoration-services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/event-decoration-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
      toast({ title: "Success", description: "Event service created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/event-decoration-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
      toast({ title: "Success", description: "Event service updated successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/event-decoration-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
      toast({ title: "Success", description: "Event service deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      serviceType: "marriage_hall",
      venueName: "",
      venueType: "indoor",
      capacity: "",
      capacitySeating: "",
      capacityStanding: "",
      hallArea: "",
      basePrice: "",
      priceType: "per_event",
      pricePerHour: "",
      pricePerDay: "",
      minimumBookingHours: "",
      minimumCharge: "",
      securityDeposit: "",
      cateringAvailable: false,
      cateringIncluded: false,
      cateringPricePerPlate: "",
      decorationIncluded: false,
      decorationCharges: "",
      djSoundAvailable: false,
      djSoundCharges: "",
      lightingCharges: "",
      parkingAvailable: false,
      parkingCapacity: "",
      parkingCharges: "",
      acAvailable: false,
      powerBackup: false,
      greenRooms: "",
      washrooms: "",
      kitchenFacility: false,
      photographyAllowed: true,
      outsideCateringAllowed: false,
      businessName: "",
      ownerName: "",
      experienceYears: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      whatsappNumber: "",
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      workingHours: "",
      advanceBookingRequired: true,
      minimumAdvanceBookingDays: "7",
      advancePaymentRequired: true,
      advancePaymentPercentage: "",
      isActive: true,
      isFeatured: false,
      images: [] as string[],
      teamSize: "",
      plannerCharges: "",
      setupCharges: "",
      quantity: "",
      minimumOrderQuantity: "",
      offSeasonDiscount: "",
      peakSeasonCharges: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Helper function to safely parse numbers
      const parseIntSafe = (value: string) => {
        if (!value || value.trim() === '') return null;
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
      };

      const parseFloatSafe = (value: string) => {
        if (!value || value.trim() === '') return null;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };

      const payload = {
        ...formData,
        userId,
        role: userRole,
        basePrice: parseFloatSafe(formData.basePrice) || 0,
        capacity: parseIntSafe(formData.capacity),
        capacitySeating: parseIntSafe(formData.capacitySeating),
        capacityStanding: parseIntSafe(formData.capacityStanding),
        hallArea: parseFloatSafe(formData.hallArea),
        pricePerHour: parseFloatSafe(formData.pricePerHour),
        pricePerDay: parseFloatSafe(formData.pricePerDay),
        minimumBookingHours: parseIntSafe(formData.minimumBookingHours),
        minimumCharge: parseFloatSafe(formData.minimumCharge),
        securityDeposit: parseFloatSafe(formData.securityDeposit),
        cateringPricePerPlate: parseFloatSafe(formData.cateringPricePerPlate),
        decorationCharges: parseFloatSafe(formData.decorationCharges),
        djSoundCharges: parseFloatSafe(formData.djSoundCharges),
        lightingCharges: parseFloatSafe(formData.lightingCharges),
        parkingCapacity: parseIntSafe(formData.parkingCapacity),
        parkingCharges: parseFloatSafe(formData.parkingCharges),
        greenRooms: parseIntSafe(formData.greenRooms),
        washrooms: parseIntSafe(formData.washrooms),
        experienceYears: parseIntSafe(formData.experienceYears),
        teamSize: parseIntSafe(formData.teamSize),
        plannerCharges: parseFloatSafe(formData.plannerCharges),
        setupCharges: parseFloatSafe(formData.setupCharges),
        minimumAdvanceBookingDays: parseIntSafe(formData.minimumAdvanceBookingDays),
        peakSeasonCharges: parseFloatSafe(formData.peakSeasonCharges),
        offSeasonDiscount: parseFloatSafe(formData.offSeasonDiscount),
        advancePaymentPercentage: parseFloatSafe(formData.advancePaymentPercentage),
        quantity: parseIntSafe(formData.quantity),
        minimumOrderQuantity: parseIntSafe(formData.minimumOrderQuantity),
      };

      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: EventDecorationService) => {
    setEditingItem(service);
    // Ensure all fields in formData are populated correctly from the service object
    // Handle potential null/undefined values for numeric fields by providing default empty strings
    setFormData({
      title: service.title || "",
      description: service.description || "",
      serviceType: service.serviceType || "marriage_hall",
      venueName: service.venueName || "",
      venueType: service.venueType || "indoor",
      capacity: service.capacity?.toString() || "",
      capacitySeating: service.capacitySeating?.toString() || "",
      capacityStanding: service.capacityStanding?.toString() || "",
      hallArea: service.hallArea?.toString() || "",
      basePrice: service.basePrice?.toString() || "",
      priceType: service.priceType || "per_event",
      pricePerHour: service.pricePerHour?.toString() || "",
      pricePerDay: service.pricePerDay?.toString() || "",
      minimumBookingHours: service.minimumBookingHours?.toString() || "",
      minimumCharge: service.minimumCharge?.toString() || "",
      securityDeposit: service.securityDeposit?.toString() || "",
      cateringAvailable: service.cateringAvailable || false,
      cateringIncluded: service.cateringIncluded || false,
      cateringPricePerPlate: service.cateringPricePerPlate?.toString() || "",
      decorationIncluded: service.decorationIncluded || false,
      decorationCharges: service.decorationCharges?.toString() || "",
      djSoundAvailable: service.djSoundAvailable || false,
      djSoundCharges: service.djSoundCharges?.toString() || "",
      lightingCharges: service.lightingCharges?.toString() || "",
      parkingAvailable: service.parkingAvailable || false,
      parkingCapacity: service.parkingCapacity?.toString() || "",
      parkingCharges: service.parkingCharges?.toString() || "",
      acAvailable: service.acAvailable || false,
      powerBackup: service.powerBackup || false,
      greenRooms: service.greenRooms?.toString() || "",
      washrooms: service.washrooms?.toString() || "",
      kitchenFacility: service.kitchenFacility || false,
      photographyAllowed: service.photographyAllowed || true,
      outsideCateringAllowed: service.outsideCateringAllowed || false,
      businessName: service.businessName || "",
      ownerName: service.ownerName || "",
      experienceYears: service.experienceYears?.toString() || "",
      contactPerson: service.contactPerson || "",
      contactPhone: service.contactPhone || "",
      contactEmail: service.contactEmail || "",
      whatsappNumber: service.whatsappNumber || "",
      country: service.country || "India",
      stateProvince: service.stateProvince || "",
      city: service.city || "",
      areaName: service.areaName || "",
      fullAddress: service.fullAddress || "",
      workingHours: service.workingHours || "",
      advanceBookingRequired: service.advanceBookingRequired || true,
      minimumAdvanceBookingDays: service.minimumAdvanceBookingDays?.toString() || "7",
      advancePaymentRequired: service.advancePaymentRequired || true,
      advancePaymentPercentage: service.advancePaymentPercentage?.toString() || "",
      isActive: service.isActive || true,
      isFeatured: service.isFeatured || false,
      images: service.images || [],
      teamSize: service.teamSize?.toString() || "",
      plannerCharges: service.plannerCharges?.toString() || "",
      setupCharges: service.setupCharges?.toString() || "",
      quantity: service.quantity?.toString() || "",
      minimumOrderQuantity: service.minimumOrderQuantity?.toString() || "",
      offSeasonDiscount: service.offSeasonDiscount?.toString() || "",
      peakSeasonCharges: service.peakSeasonCharges?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await fetch(`/api/admin/event-decoration-services/${id}/toggle-active`, { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
    } catch (error) {
      console.error("Error toggling active status:", error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      await fetch(`/api/admin/event-decoration-services/${id}/toggle-featured`, { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-decoration-services"] });
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
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
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newUrls]
      }));

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
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event & Decoration Services</h2>
          <p className="text-muted-foreground">Manage marriage halls, party venues, café setups, and decoration materials</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingItem(null); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Event Service" : "Add New Event Service"}</DialogTitle>
            <DialogDescription>Fill in the details for the event or decoration service</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marriage_hall">Marriage Hall</SelectItem>
                    <SelectItem value="party_venue">Party Venue</SelectItem>
                    <SelectItem value="cafe_setup">Café Setup</SelectItem>
                    <SelectItem value="decoration_materials">Decoration Materials</SelectItem>
                    <SelectItem value="decoration_service">Decoration Service</SelectItem>
                    <SelectItem value="event_planning">Event Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input id="venueName" value={formData.venueName} onChange={(e) => setFormData({ ...formData, venueName: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueType">Venue Type</Label>
                <Select value={formData.venueType} onValueChange={(value) => setFormData({ ...formData, venueType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity</Label>
                <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacitySeating">Seating Capacity</Label>
                <Input id="capacitySeating" type="number" value={formData.capacitySeating} onChange={(e) => setFormData({ ...formData, capacitySeating: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacityStanding">Standing Capacity</Label>
                <Input id="capacityStanding" type="number" value={formData.capacityStanding} onChange={(e) => setFormData({ ...formData, capacityStanding: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hallArea">Hall Area (sq ft)</Label>
                <Input id="hallArea" type="number" value={formData.hallArea} onChange={(e) => setFormData({ ...formData, hallArea: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price *</Label>
                <Input id="basePrice" type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceType">Price Type *</Label>
                <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_event">Per Event</SelectItem>
                    <SelectItem value="per_day">Per Day</SelectItem>
                    <SelectItem value="per_hour">Per Hour</SelectItem>
                    <SelectItem value="per_plate">Per Plate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.priceType === "per_hour" && (
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Price Per Hour</Label>
                  <Input id="pricePerHour" type="number" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })} />
                </div>
              )}

              {formData.priceType === "per_day" && (
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price Per Day</Label>
                  <Input id="pricePerDay" type="number" value={formData.pricePerDay} onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} />
                </div>
              )}

              {formData.priceType === "per_plate" && (
                <div className="space-y-2">
                  <Label htmlFor="cateringPricePerPlate">Catering Price Per Plate</Label>
                  <Input id="cateringPricePerPlate" type="number" value={formData.cateringPricePerPlate} onChange={(e) => setFormData({ ...formData, cateringPricePerPlate: e.target.value })} />
                </div>
              )}

              {formData.priceType === "per_event" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="minimumBookingHours">Minimum Booking Hours</Label>
                    <Input id="minimumBookingHours" type="number" value={formData.minimumBookingHours} onChange={(e) => setFormData({ ...formData, minimumBookingHours: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumCharge">Minimum Charge</Label>
                    <Input id="minimumCharge" type="number" value={formData.minimumCharge} onChange={(e) => setFormData({ ...formData, minimumCharge: e.target.value })} />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <Input id="securityDeposit" type="number" value={formData.securityDeposit} onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input id="contactPhone" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input id="whatsappNumber" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stateProvince">State/Province</Label>
                <Input id="stateProvince" value={formData.stateProvince} onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaName">Area Name</Label>
                <Input id="areaName" value={formData.areaName} onChange={(e) => setFormData({ ...formData, areaName: e.target.value })} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <Textarea id="fullAddress" value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input id="workingHours" value={formData.workingHours} onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.cateringAvailable} onCheckedChange={(checked) => setFormData({ ...formData, cateringAvailable: checked })} />
                    <Label>Catering Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.decorationIncluded} onCheckedChange={(checked) => setFormData({ ...formData, decorationIncluded: checked })} />
                    <Label>Decoration Included</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.djSoundAvailable} onCheckedChange={(checked) => setFormData({ ...formData, djSoundAvailable: checked })} />
                    <Label>DJ & Sound Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.parkingAvailable} onCheckedChange={(checked) => setFormData({ ...formData, parkingAvailable: checked })} />
                    <Label>Parking Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.acAvailable} onCheckedChange={(checked) => setFormData({ ...formData, acAvailable: checked })} />
                    <Label>AC Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.powerBackup} onCheckedChange={(checked) => setFormData({ ...formData, powerBackup: checked })} />
                    <Label>Power Backup</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.kitchenFacility} onCheckedChange={(checked) => setFormData({ ...formData, kitchenFacility: checked })} />
                    <Label>Kitchen Facility</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.photographyAllowed} onCheckedChange={(checked) => setFormData({ ...formData, photographyAllowed: checked })} />
                    <Label>Photography Allowed</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.outsideCateringAllowed} onCheckedChange={(checked) => setFormData({ ...formData, outsideCateringAllowed: checked })} />
                    <Label>Outside Catering Allowed</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="decorationCharges">Decoration Charges</Label>
                <Input id="decorationCharges" type="number" value={formData.decorationCharges} onChange={(e) => setFormData({ ...formData, decorationCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="djSoundCharges">DJ & Sound Charges</Label>
                <Input id="djSoundCharges" type="number" value={formData.djSoundCharges} onChange={(e) => setFormData({ ...formData, djSoundCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lightingCharges">Lighting Charges</Label>
                <Input id="lightingCharges" type="number" value={formData.lightingCharges} onChange={(e) => setFormData({ ...formData, lightingCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingCapacity">Parking Capacity</Label>
                <Input id="parkingCapacity" type="number" value={formData.parkingCapacity} onChange={(e) => setFormData({ ...formData, parkingCapacity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingCharges">Parking Charges</Label>
                <Input id="parkingCharges" type="number" value={formData.parkingCharges} onChange={(e) => setFormData({ ...formData, parkingCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="greenRooms">Number of Green Rooms</Label>
                <Input id="greenRooms" type="number" value={formData.greenRooms} onChange={(e) => setFormData({ ...formData, greenRooms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="washrooms">Number of Washrooms</Label>
                <Input id="washrooms" type="number" value={formData.washrooms} onChange={(e) => setFormData({ ...formData, washrooms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Experience Years</Label>
                <Input id="experienceYears" type="number" value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input id="teamSize" type="number" value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plannerCharges">Planner Charges</Label>
                <Input id="plannerCharges" type="number" value={formData.plannerCharges} onChange={(e) => setFormData({ ...formData, plannerCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setupCharges">Setup Charges</Label>
                <Input id="setupCharges" type="number" value={formData.setupCharges} onChange={(e) => setFormData({ ...formData, setupCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumAdvanceBookingDays">Minimum Advance Booking Days</Label>
                <Input id="minimumAdvanceBookingDays" type="number" value={formData.minimumAdvanceBookingDays} onChange={(e) => setFormData({ ...formData, minimumAdvanceBookingDays: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advancePaymentPercentage">Advance Payment Percentage (%)</Label>
                <Input id="advancePaymentPercentage" type="number" value={formData.advancePaymentPercentage} onChange={(e) => setFormData({ ...formData, advancePaymentPercentage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity</Label>
                <Input id="minimumOrderQuantity" type="number" value={formData.minimumOrderQuantity} onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peakSeasonCharges">Peak Season Charges</Label>
                <Input id="peakSeasonCharges" type="number" value={formData.peakSeasonCharges} onChange={(e) => setFormData({ ...formData, peakSeasonCharges: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offSeasonDiscount">Off-Season Discount (%)</Label>
                <Input id="offSeasonDiscount" type="number" value={formData.offSeasonDiscount} onChange={(e) => setFormData({ ...formData, offSeasonDiscount: e.target.value })} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mt-2"
                    disabled={uploadingImages}
                  />
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

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isFeatured} onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })} />
                <Label>Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? "Update" : "Create"} Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                  <Badge variant="secondary">{service.serviceType.replace('_', ' ')}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setViewingItem(service); setViewDialogOpen(true); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{service.venueName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{service.city || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{service.contactPhone}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-primary">₹{Number(service.basePrice).toLocaleString()}</span>
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => toggleActive(service.id)} className="flex-1">
                  {service.isActive ? 'Active' : 'Inactive'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleFeatured(service.id)} className="flex-1">
                  {service.isFeatured ? 'Featured' : 'Not Featured'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewingItem && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingItem.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{viewingItem.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Service Type:</strong> {viewingItem.serviceType}</div>
                <div><strong>Base Price:</strong> ₹{Number(viewingItem.basePrice).toLocaleString()}</div>
                <div><strong>Contact:</strong> {viewingItem.contactPhone}</div>
                <div><strong>City:</strong> {viewingItem.city || 'N/A'}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}