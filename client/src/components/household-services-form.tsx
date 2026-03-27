import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  serviceType: z.enum(["plumbing", "cleaning", "electrical", "carpentry", "painting", "pest_control", "appliance_repair", "gardening", "ac_repair", "home_maintenance", "other"]),
  serviceCategory: z.enum(["repair", "installation", "maintenance", "cleaning", "renovation", "emergency"]).optional(),
  baseServiceCharge: z.string().min(1, "Base charge is required"),
  hourlyRate: z.string().optional(),
  minimumCharge: z.string().optional(),
  pricingType: z.enum(["fixed", "hourly", "per_visit", "contract"]).default("fixed"),
  freeInspection: z.boolean().default(false),
  freeEstimate: z.boolean().default(true),
  emergencyService: z.boolean().default(false),
  emergencyCharges: z.string().optional(),
  sameDayService: z.boolean().default(false),
  warrantyProvided: z.boolean().default(false),
  warrantyPeriod: z.string().optional(),
  available24_7: z.boolean().default(false),
  workingHours: z.string().optional(),
  workingDays: z.string().optional(),
  advanceBookingRequired: z.boolean().default(false),
  businessName: z.string().optional(),
  ownerName: z.string().optional(),
  experienceYears: z.number().optional(),
  teamSize: z.number().optional(),
  certifiedProfessional: z.boolean().default(false),
  residentialService: z.boolean().default(true),
  commercialService: z.boolean().default(false),
  equipmentProvided: z.boolean().default(true),
  materialsIncluded: z.boolean().default(false),
  contactPerson: z.string().min(2, "Contact person name required"),
  contactPhone: z.string().min(10, "Valid phone number required"),
  contactEmail: z.string().email().optional().or(z.literal("")),
  whatsappAvailable: z.boolean().default(false),
  country: z.string().default("India"),
  stateProvince: z.string().optional(),
  city: z.string().optional(),
  areaName: z.string().optional(),
  fullAddress: z.string().min(5, "Full address is required"),
  serviceRadiusKm: z.number().optional(),
  homeVisitAvailable: z.boolean().default(true),
  consultationAvailable: z.boolean().default(false),
  seniorCitizenDiscount: z.boolean().default(false),
  contractAvailable: z.boolean().default(false),
  amcAvailable: z.boolean().default(false),
  cashOnDelivery: z.boolean().default(true),
  digitalPayment: z.boolean().default(true),
  images: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface HouseholdServicesFormProps {
  onSuccess?: () => void;
  editingService?: any;
}

export default function HouseholdServicesForm({ onSuccess, editingService }: HouseholdServicesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: editingService ? {
      title: editingService.title || "",
      description: editingService.description || "",
      serviceType: editingService.serviceType || "plumbing",
      serviceCategory: editingService.serviceCategory || undefined,
      baseServiceCharge: editingService.baseServiceCharge?.toString() || "",
      hourlyRate: editingService.hourlyRate?.toString() || "",
      minimumCharge: editingService.minimumCharge?.toString() || "",
      pricingType: editingService.pricingType || "fixed",
      freeInspection: editingService.freeInspection || false,
      freeEstimate: editingService.freeEstimate !== undefined ? editingService.freeEstimate : true,
      emergencyService: editingService.emergencyService || false,
      emergencyCharges: editingService.emergencyCharges?.toString() || "",
      sameDayService: editingService.sameDayService || false,
      warrantyProvided: editingService.warrantyProvided || false,
      warrantyPeriod: editingService.warrantyPeriod || "",
      available24_7: editingService.available24_7 || false,
      workingHours: editingService.workingHours || "",
      workingDays: editingService.workingDays || "",
      advanceBookingRequired: editingService.advanceBookingRequired || false,
      businessName: editingService.businessName || "",
      ownerName: editingService.ownerName || "",
      experienceYears: editingService.experienceYears || undefined,
      teamSize: editingService.teamSize || undefined,
      certifiedProfessional: editingService.certifiedProfessional || false,
      residentialService: editingService.residentialService !== undefined ? editingService.residentialService : true,
      commercialService: editingService.commercialService || false,
      equipmentProvided: editingService.equipmentProvided !== undefined ? editingService.equipmentProvided : true,
      materialsIncluded: editingService.materialsIncluded || false,
      contactPerson: editingService.contactPerson || "",
      contactPhone: editingService.contactPhone || "",
      contactEmail: editingService.contactEmail || "",
      whatsappAvailable: editingService.whatsappAvailable || false,
      country: editingService.country || "India",
      stateProvince: editingService.stateProvince || "",
      city: editingService.city || "",
      areaName: editingService.areaName || "",
      fullAddress: editingService.fullAddress || "",
      serviceRadiusKm: editingService.serviceRadiusKm || undefined,
      homeVisitAvailable: editingService.homeVisitAvailable !== undefined ? editingService.homeVisitAvailable : true,
      consultationAvailable: editingService.consultationAvailable || false,
      seniorCitizenDiscount: editingService.seniorCitizenDiscount || false,
      contractAvailable: editingService.contractAvailable || false,
      amcAvailable: editingService.amcAvailable || false,
      cashOnDelivery: editingService.cashOnDelivery !== undefined ? editingService.cashOnDelivery : true,
      digitalPayment: editingService.digitalPayment !== undefined ? editingService.digitalPayment : true,
      images: editingService.images || [],
    } : {
      serviceType: "plumbing",
      pricingType: "fixed",
      freeInspection: false,
      freeEstimate: true,
      emergencyService: false,
      sameDayService: false,
      warrantyProvided: false,
      available24_7: false,
      advanceBookingRequired: false,
      certifiedProfessional: false,
      residentialService: true,
      commercialService: false,
      equipmentProvided: true,
      materialsIncluded: false,
      whatsappAvailable: false,
      country: "India",
      homeVisitAvailable: true,
      consultationAvailable: false,
      seniorCitizenDiscount: false,
      contractAvailable: false,
      amcAvailable: false,
      cashOnDelivery: true,
      digitalPayment: true,
      images: [],
    },
  });

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
        ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === 'string' && u.length > 0)
        : [];
      return urls;
    };

    try {
      const fileArr = Array.from(files);
      const newUrls = await uploadMultipleFiles(fileArr);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...newUrls]);

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
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingService 
        ? `/api/admin/household-services/${editingService.id}`
        : "/api/admin/household-services";

      const method = editingService ? "PUT" : "POST";

      // Convert empty strings to null for numeric fields
      const sanitizedData = {
        ...data,
        userId,
        role: userRole,
        baseServiceCharge: data.baseServiceCharge || null,
        hourlyRate: data.hourlyRate || null,
        minimumCharge: data.minimumCharge || null,
        emergencyCharges: data.emergencyCharges || null,
        experienceYears: data.experienceYears || null,
        teamSize: data.teamSize || null,
        serviceRadiusKm: data.serviceRadiusKm || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${editingService ? 'update' : 'create'} service listing`);
      }

      const result = await response.json();
      console.log(`${editingService ? 'Updated' : 'Created'} service:`, result);
      alert(`Service listing ${editingService ? 'updated' : 'created'} successfully!`);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error instanceof Error ? error.message : `Failed to ${editingService ? 'update' : 'create'} service listing`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>Enter the basic details of your household service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Professional Plumbing Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of your services..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="carpentry">Carpentry</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="pest_control">Pest Control</SelectItem>
                        <SelectItem value="appliance_repair">Appliance Repair</SelectItem>
                        <SelectItem value="gardening">Gardening</SelectItem>
                        <SelectItem value="ac_repair">AC Repair</SelectItem>
                        <SelectItem value="home_maintenance">Home Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload service images (optional)</CardDescription>
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
                className="mt-2" 
                disabled={uploadingImages}
              />
              {uploadingImages && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>
            {form.watch("images") && form.watch("images").length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {form.watch("images").map((img: string, idx: number) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="per_visit">Per Visit</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="baseServiceCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Service Charge (₹) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Charge (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="freeInspection"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Free Inspection</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeEstimate"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Free Estimate</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="emergencyService"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Emergency Service</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sameDayService"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Same Day Service</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available24_7"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">24/7 Available</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyProvided"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Warranty</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifiedProfessional"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Certified</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipmentProvided"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Equipment Provided</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materialsIncluded"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Materials Included</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeVisitAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Home Visit</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9 AM - 6 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Days</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Monday - Saturday" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Owner's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="3" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="residentialService"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Residential</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commercialService"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Commercial</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Contract</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amcAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">AMC Available</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whatsappAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">WhatsApp Available</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Service Area</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input placeholder="Andheri West" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceRadiusKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Radius (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Complete business address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Discounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="cashOnDelivery"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Cash Payment</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="digitalPayment"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Digital Payment</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seniorCitizenDiscount"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Senior Discount</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : (editingService ? "Update Service Listing" : "Create Service Listing")}
        </Button>
      </form>
    </Form>
  );
}