
import { useState } from "react";
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
import { Plus, Edit, Trash2, Eye, Wifi, Monitor, Printer, Clock } from "lucide-react";

type CyberCafeFormData = {
  title: string;
  description?: string;
  cafeName: string;
  serviceType: string;
  internetPricePerHour: number;
  internetPricePerDay?: number;
  printingPriceBw?: number;
  printingPriceColor?: number;
  scanningPrice?: number;
  photocopyingPrice?: number;
  gamingPricePerHour?: number;
  minimumCharge?: number;
  totalComputers?: number;
  availableComputers?: number;
  computerSpecifications?: string;
  internetSpeed?: string;
  numberOfCabins?: number;
  ownerName?: string;
  licenseNumber?: string;
  establishedYear?: number;
  experienceYears?: number;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  city?: string;
  stateProvince?: string;
  areaName?: string;
  fullAddress: string;
  nearbyLandmarks?: string;
  workingHours?: string;
  workingDays?: string;
  holidayList?: string;
  studentDiscountPercentage?: number;
  internetBrowsing?: boolean;
  printingService?: boolean;
  scanningService?: boolean;
  photocopyingService?: boolean;
  laminationService?: boolean;
  bindingService?: boolean;
  gamingAvailable?: boolean;
  videoConferencing?: boolean;
  onlineClassesSupport?: boolean;
  membershipAvailable?: boolean;
  wifiAvailable?: boolean;
  privateCabins?: boolean;
  acAvailable?: boolean;
  parkingAvailable?: boolean;
  gamingSetup?: boolean;
  whatsappAvailable?: boolean;
  open24_7?: boolean;
  studentDiscount?: boolean;
  bulkPrintingDiscount?: boolean;
  homeDelivery?: boolean;
  pickupService?: boolean;
  onlineBooking?: boolean;
  prepaidPackages?: boolean;
  cctvSurveillance?: boolean;
  dataPrivacyEnsured?: boolean;
  antivirusInstalled?: boolean;
  firewallProtection?: boolean;
  foodBeveragesAvailable?: boolean;
  stationaryAvailable?: boolean;
  chargingPoints?: boolean;
  restArea?: boolean;
  examFormFilling?: boolean;
  resumeMaking?: boolean;
  documentTyping?: boolean;
  translationService?: boolean;
  passportPhoto?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function CyberCafeInternetServicesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<CyberCafeFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["cyber-cafe-internet-services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/cyber-cafe-internet-services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CyberCafeFormData) => {
      const response = await fetch("/api/admin/cyber-cafe-internet-services", {
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
      queryClient.invalidateQueries({ queryKey: ["cyber-cafe-internet-services"] });
      toast({ title: "Success", description: "Service created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CyberCafeFormData }) => {
      const response = await fetch(`/api/admin/cyber-cafe-internet-services/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["cyber-cafe-internet-services"] });
      toast({ title: "Success", description: "Service updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cyber-cafe-internet-services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyber-cafe-internet-services"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    reset();
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    Object.keys(service).forEach((key) => {
      setValue(key as any, service[key]);
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CyberCafeFormData) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'cyber_cafe':
        return <Monitor className="h-5 w-5 text-blue-600" />;
      case 'gaming_cafe':
        return <Monitor className="h-5 w-5 text-purple-600" />;
      case 'internet_cafe':
        return <Wifi className="h-5 w-5 text-green-600" />;
      case 'business_center':
        return <Printer className="h-5 w-5 text-orange-600" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cyber Café / Internet Services</h2>
          <p className="text-muted-foreground">Manage cyber café and internet service providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      {getServiceIcon(service.serviceType)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.cafeName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.serviceType.replace('_', ' ')}</Badge>
                          {service.wifiAvailable && <Badge className="bg-blue-600">WiFi</Badge>}
                          {service.acAvailable && <Badge className="bg-green-600">AC</Badge>}
                          {service.open24_7 && <Badge className="bg-purple-600">24/7</Badge>}
                          {service.gamingAvailable && <Badge className="bg-orange-600">Gaming</Badge>}
                          {service.printingService && <Badge className="bg-cyan-600">Printing</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          ₹{Number(service.internetPricePerHour).toLocaleString()}/hour
                          {service.internetSpeed && <span className="ml-2 text-green-600 font-semibold">• {service.internetSpeed}</span>}
                        </p>
                        {service.city && <p className="text-sm text-muted-foreground">{service.city}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingService(service)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this service?")) {
                          deleteMutation.mutate(service.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Cyber Café Service</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input id="title" {...register("title", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cafeName">Café Name *</Label>
                    <Input id="cafeName" {...register("cafeName", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select onValueChange={(value) => setValue("serviceType", value)} defaultValue={editingService?.serviceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cyber_cafe">Cyber Café</SelectItem>
                        <SelectItem value="internet_cafe">Internet Café</SelectItem>
                        <SelectItem value="gaming_cafe">Gaming Café</SelectItem>
                        <SelectItem value="business_center">Business Center</SelectItem>
                        <SelectItem value="coworking_with_internet">Coworking with Internet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" {...register("ownerName")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input id="licenseNumber" {...register("licenseNumber")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year</Label>
                    <Input id="establishedYear" type="number" {...register("establishedYear", { valueAsNumber: true })} />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} rows={3} />
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
                  <div className="space-y-2">
                    <Label htmlFor="internetPricePerHour">Internet Price/Hour (₹) *</Label>
                    <Input id="internetPricePerHour" type="number" step="0.01" {...register("internetPricePerHour", { required: true, valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internetPricePerDay">Internet Price/Day (₹)</Label>
                    <Input id="internetPricePerDay" type="number" step="0.01" {...register("internetPricePerDay", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingPriceBw">B&W Printing/Page (₹)</Label>
                    <Input id="printingPriceBw" type="number" step="0.01" {...register("printingPriceBw", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingPriceColor">Color Printing/Page (₹)</Label>
                    <Input id="printingPriceColor" type="number" step="0.01" {...register("printingPriceColor", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scanningPrice">Scanning Price (₹)</Label>
                    <Input id="scanningPrice" type="number" step="0.01" {...register("scanningPrice", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photocopyingPrice">Photocopying Price (₹)</Label>
                    <Input id="photocopyingPrice" type="number" step="0.01" {...register("photocopyingPrice", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gamingPricePerHour">Gaming Price/Hour (₹)</Label>
                    <Input id="gamingPricePerHour" type="number" step="0.01" {...register("gamingPricePerHour", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumCharge">Minimum Charge (₹)</Label>
                    <Input id="minimumCharge" type="number" step="0.01" {...register("minimumCharge", { valueAsNumber: true })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities & Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities & Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalComputers">Total Computers</Label>
                    <Input id="totalComputers" type="number" {...register("totalComputers", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableComputers">Available Computers</Label>
                    <Input id="availableComputers" type="number" {...register("availableComputers", { valueAsNumber: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internetSpeed">Internet Speed</Label>
                    <Input id="internetSpeed" {...register("internetSpeed")} placeholder="e.g., 100 Mbps" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="computerSpecifications">Computer Specifications</Label>
                    <Input id="computerSpecifications" {...register("computerSpecifications")} placeholder="e.g., i5, 8GB RAM" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfCabins">Number of Private Cabins</Label>
                    <Input id="numberOfCabins" type="number" {...register("numberOfCabins", { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="internetBrowsing" defaultChecked onCheckedChange={(checked) => setValue("internetBrowsing", checked)} />
                    <Label htmlFor="internetBrowsing">Internet Browsing</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="printingService" defaultChecked onCheckedChange={(checked) => setValue("printingService", checked)} />
                    <Label htmlFor="printingService">Printing Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="scanningService" defaultChecked onCheckedChange={(checked) => setValue("scanningService", checked)} />
                    <Label htmlFor="scanningService">Scanning Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="photocopyingService" defaultChecked onCheckedChange={(checked) => setValue("photocopyingService", checked)} />
                    <Label htmlFor="photocopyingService">Photocopying</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="laminationService" onCheckedChange={(checked) => setValue("laminationService", checked)} />
                    <Label htmlFor="laminationService">Lamination</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="bindingService" onCheckedChange={(checked) => setValue("bindingService", checked)} />
                    <Label htmlFor="bindingService">Binding</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="gamingAvailable" onCheckedChange={(checked) => setValue("gamingAvailable", checked)} />
                    <Label htmlFor="gamingAvailable">Gaming Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="videoConferencing" onCheckedChange={(checked) => setValue("videoConferencing", checked)} />
                    <Label htmlFor="videoConferencing">Video Conferencing</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="onlineClassesSupport" onCheckedChange={(checked) => setValue("onlineClassesSupport", checked)} />
                    <Label htmlFor="onlineClassesSupport">Online Classes Support</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="wifiAvailable" onCheckedChange={(checked) => setValue("wifiAvailable", checked)} />
                    <Label htmlFor="wifiAvailable">WiFi Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="acAvailable" onCheckedChange={(checked) => setValue("acAvailable", checked)} />
                    <Label htmlFor="acAvailable">AC Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="parkingAvailable" onCheckedChange={(checked) => setValue("parkingAvailable", checked)} />
                    <Label htmlFor="parkingAvailable">Parking Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="privateCabins" onCheckedChange={(checked) => setValue("privateCabins", checked)} />
                    <Label htmlFor="privateCabins">Private Cabins</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="gamingSetup" onCheckedChange={(checked) => setValue("gamingSetup", checked)} />
                    <Label htmlFor="gamingSetup">Gaming Setup</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="membershipAvailable" onCheckedChange={(checked) => setValue("membershipAvailable", checked)} />
                    <Label htmlFor="membershipAvailable">Membership Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="studentDiscount" onCheckedChange={(checked) => setValue("studentDiscount", checked)} />
                    <Label htmlFor="studentDiscount">Student Discount</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="bulkPrintingDiscount" onCheckedChange={(checked) => setValue("bulkPrintingDiscount", checked)} />
                    <Label htmlFor="bulkPrintingDiscount">Bulk Printing Discount</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="homeDelivery" onCheckedChange={(checked) => setValue("homeDelivery", checked)} />
                    <Label htmlFor="homeDelivery">Home Delivery</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="pickupService" onCheckedChange={(checked) => setValue("pickupService", checked)} />
                    <Label htmlFor="pickupService">Pickup Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="onlineBooking" onCheckedChange={(checked) => setValue("onlineBooking", checked)} />
                    <Label htmlFor="onlineBooking">Online Booking</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="prepaidPackages" onCheckedChange={(checked) => setValue("prepaidPackages", checked)} />
                    <Label htmlFor="prepaidPackages">Prepaid Packages</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="examFormFilling" onCheckedChange={(checked) => setValue("examFormFilling", checked)} />
                    <Label htmlFor="examFormFilling">Exam Form Filling</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="resumeMaking" onCheckedChange={(checked) => setValue("resumeMaking", checked)} />
                    <Label htmlFor="resumeMaking">Resume Making</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="documentTyping" onCheckedChange={(checked) => setValue("documentTyping", checked)} />
                    <Label htmlFor="documentTyping">Document Typing</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="translationService" onCheckedChange={(checked) => setValue("translationService", checked)} />
                    <Label htmlFor="translationService">Translation Service</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="passportPhoto" onCheckedChange={(checked) => setValue("passportPhoto", checked)} />
                    <Label htmlFor="passportPhoto">Passport Photo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="foodBeveragesAvailable" onCheckedChange={(checked) => setValue("foodBeveragesAvailable", checked)} />
                    <Label htmlFor="foodBeveragesAvailable">Food & Beverages</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="stationaryAvailable" onCheckedChange={(checked) => setValue("stationaryAvailable", checked)} />
                    <Label htmlFor="stationaryAvailable">Stationary Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="chargingPoints" onCheckedChange={(checked) => setValue("chargingPoints", checked)} />
                    <Label htmlFor="chargingPoints">Charging Points</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="restArea" onCheckedChange={(checked) => setValue("restArea", checked)} />
                    <Label htmlFor="restArea">Rest Area</Label>
                  </div>
                </div>

                {watch("studentDiscount") && (
                  <div className="space-y-2">
                    <Label htmlFor="studentDiscountPercentage">Student Discount Percentage</Label>
                    <Input id="studentDiscountPercentage" type="number" step="0.01" {...register("studentDiscountPercentage", { valueAsNumber: true })} placeholder="e.g., 10" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="cctvSurveillance" onCheckedChange={(checked) => setValue("cctvSurveillance", checked)} />
                    <Label htmlFor="cctvSurveillance">CCTV Surveillance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="dataPrivacyEnsured" defaultChecked onCheckedChange={(checked) => setValue("dataPrivacyEnsured", checked)} />
                    <Label htmlFor="dataPrivacyEnsured">Data Privacy Ensured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="antivirusInstalled" defaultChecked onCheckedChange={(checked) => setValue("antivirusInstalled", checked)} />
                    <Label htmlFor="antivirusInstalled">Antivirus Installed</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="firewallProtection" defaultChecked onCheckedChange={(checked) => setValue("firewallProtection", checked)} />
                    <Label htmlFor="firewallProtection">Firewall Protection</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input id="contactPerson" {...register("contactPerson", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" {...register("contactPhone", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input id="alternatePhone" {...register("alternatePhone")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" {...register("whatsappNumber")} />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Switch id="whatsappAvailable" onCheckedChange={(checked) => setValue("whatsappAvailable", checked)} />
                    <Label htmlFor="whatsappAvailable">WhatsApp Available</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Input id="stateProvince" {...register("stateProvince")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaName">Area Name</Label>
                    <Input id="areaName" {...register("areaName")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nearbyLandmarks">Nearby Landmarks</Label>
                    <Input id="nearbyLandmarks" {...register("nearbyLandmarks")} />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="fullAddress">Full Address *</Label>
                    <Input id="fullAddress" {...register("fullAddress", { required: true })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input id="workingHours" {...register("workingHours")} placeholder="e.g., 9 AM - 9 PM" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workingDays">Working Days</Label>
                    <Input id="workingDays" {...register("workingDays")} placeholder="e.g., Monday - Saturday" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holidayList">Holiday List</Label>
                    <Input id="holidayList" {...register("holidayList")} placeholder="e.g., National holidays" />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Switch id="open24_7" onCheckedChange={(checked) => setValue("open24_7", checked)} />
                    <Label htmlFor="open24_7">Open 24/7</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} />
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
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingService && (
        <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingService.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Café Name</p>
                  <p className="text-sm text-muted-foreground">{viewingService.cafeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Service Type</p>
                  <p className="text-sm text-muted-foreground">{viewingService.serviceType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Internet Price/Hour</p>
                  <p className="text-sm text-muted-foreground">₹{Number(viewingService.internetPricePerHour).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Internet Speed</p>
                  <p className="text-sm text-muted-foreground">{viewingService.internetSpeed || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{viewingService.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Computers</p>
                  <p className="text-sm text-muted-foreground">{viewingService.totalComputers || 'N/A'}</p>
                </div>
              </div>

              {viewingService.description && (
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{viewingService.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Services Offered</p>
                <div className="flex flex-wrap gap-2">
                  {viewingService.internetBrowsing && <Badge>Internet Browsing</Badge>}
                  {viewingService.printingService && <Badge>Printing</Badge>}
                  {viewingService.scanningService && <Badge>Scanning</Badge>}
                  {viewingService.photocopyingService && <Badge>Photocopying</Badge>}
                  {viewingService.gamingAvailable && <Badge>Gaming</Badge>}
                  {viewingService.videoConferencing && <Badge>Video Conferencing</Badge>}
                  {viewingService.onlineClassesSupport && <Badge>Online Classes Support</Badge>}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {viewingService.wifiAvailable && <Badge variant="outline">WiFi</Badge>}
                  {viewingService.acAvailable && <Badge variant="outline">AC</Badge>}
                  {viewingService.parkingAvailable && <Badge variant="outline">Parking</Badge>}
                  {viewingService.privateCabins && <Badge variant="outline">Private Cabins</Badge>}
                  {viewingService.cctvSurveillance && <Badge variant="outline">CCTV</Badge>}
                  {viewingService.open24_7 && <Badge variant="outline">24/7 Open</Badge>}
                </div>
              </div>

              {viewingService.fullAddress && (
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{viewingService.fullAddress}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
