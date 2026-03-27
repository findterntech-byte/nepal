import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  listingType: z.enum(["sale", "rent", "service"]),
  category: z.enum(["furniture", "decor", "furnishing", "lighting", "storage", "outdoor", "custom"]),
  subcategory: z.string().optional(),
  itemType: z.string().optional(),
  brand: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  condition: z.enum(["new", "like new", "good", "fair", "needs repair"]).optional(),
  ageInMonths: z.number().optional(),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  rentalPricePerDay: z.string().optional(),
  rentalPricePerMonth: z.string().optional(),
  isNegotiable: z.boolean().default(false),
  assemblyRequired: z.boolean().default(false),
  assemblyServiceAvailable: z.boolean().default(false),
  customMade: z.boolean().default(false),
  customizationAvailable: z.boolean().default(false),
  style: z.string().optional(),
  roomType: z.string().optional(),
  seatingCapacity: z.number().optional(),
  warrantyAvailable: z.boolean().default(false),
  warrantyPeriod: z.string().optional(),
  billAvailable: z.boolean().default(false),
  isSet: z.boolean().default(false),
  setItems: z.number().optional(),
  deliveryAvailable: z.boolean().default(false),
  freeDelivery: z.boolean().default(false),
  exchangeAccepted: z.boolean().default(false),
  contactPhone: z.string().min(10, "Valid phone number required"),
  contactEmail: z.string().email().optional().or(z.literal("")),
  whatsappAvailable: z.boolean().default(false),
  country: z.string().default("India"),
  stateProvince: z.string().optional(),
  city: z.string().optional(),
  areaName: z.string().optional(),
  fullAddress: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FurnitureInteriorDecorFormProps {
  editingItem?: any;
  onSuccess?: () => void;
}

export default function FurnitureInteriorDecorForm({ editingItem, onSuccess }: FurnitureInteriorDecorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) {
      throw new Error('Please select at least 1 image');
    }
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
    defaultValues: editingItem ? {
      title: editingItem.title || "",
      description: editingItem.description || "",
      listingType: editingItem.listingType || "sale",
      category: editingItem.category || "furniture",
      subcategory: editingItem.subcategory || "",
      itemType: editingItem.itemType || "",
      brand: editingItem.brand || "",
      material: editingItem.material || "",
      color: editingItem.color || "",
      dimensions: editingItem.dimensions || "",
      weight: editingItem.weight || "",
      condition: editingItem.condition || undefined,
      ageInMonths: editingItem.ageInMonths ? Number(editingItem.ageInMonths) : undefined,
      price: editingItem.price ? editingItem.price.toString() : "",
      originalPrice: editingItem.originalPrice ? editingItem.originalPrice.toString() : "",
      rentalPricePerDay: editingItem.rentalPricePerDay ? editingItem.rentalPricePerDay.toString() : "",
      rentalPricePerMonth: editingItem.rentalPricePerMonth ? editingItem.rentalPricePerMonth.toString() : "",
      isNegotiable: editingItem.isNegotiable === true,
      assemblyRequired: editingItem.assemblyRequired === true,
      assemblyServiceAvailable: editingItem.assemblyServiceAvailable === true,
      customMade: editingItem.customMade === true,
      customizationAvailable: editingItem.customizationAvailable === true,
      style: editingItem.style || "",
      roomType: editingItem.roomType || "",
      seatingCapacity: editingItem.seatingCapacity ? Number(editingItem.seatingCapacity) : undefined,
      warrantyAvailable: editingItem.warrantyAvailable === true,
      warrantyPeriod: editingItem.warrantyPeriod || "",
      billAvailable: editingItem.billAvailable === true,
      isSet: editingItem.isSet === true,
      setItems: editingItem.setItems ? Number(editingItem.setItems) : undefined,
      deliveryAvailable: editingItem.deliveryAvailable === true,
      freeDelivery: editingItem.freeDelivery === true,
      exchangeAccepted: editingItem.exchangeAccepted === true,
      contactPhone: editingItem.contactPhone || "",
      contactEmail: editingItem.contactEmail || "",
      whatsappAvailable: editingItem.whatsappAvailable === true,
      country: editingItem.country || "India",
      stateProvince: editingItem.stateProvince || "",
      city: editingItem.city || "",
      areaName: editingItem.areaName || "",
      fullAddress: editingItem.fullAddress || "",
      images: editingItem.images || [],
    } : {
      title: "",
      description: "",
      listingType: "sale",
      category: "furniture",
      subcategory: "",
      itemType: "",
      brand: "",
      material: "",
      color: "",
      dimensions: "",
      weight: "",
      price: "",
      originalPrice: "",
      rentalPricePerDay: "",
      rentalPricePerMonth: "",
      isNegotiable: false,
      assemblyRequired: false,
      assemblyServiceAvailable: false,
      customMade: false,
      customizationAvailable: false,
      style: "",
      roomType: "",
      warrantyAvailable: false,
      warrantyPeriod: "",
      billAvailable: false,
      isSet: false,
      deliveryAvailable: false,
      freeDelivery: false,
      exchangeAccepted: false,
      contactPhone: "",
      contactEmail: "",
      whatsappAvailable: false,
      country: "India",
      stateProvince: "",
      city: "",
      areaName: "",
      fullAddress: "",
      images: [],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const currentImages = form.getValues("images") || [];
      const selected = Array.from(files);
      const uploadedUrls = await uploadMultipleFiles(selected);
      form.setValue("images", [...currentImages, ...uploadedUrls]);

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
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `/api/admin/furniture-interior-decor/${editingItem.id}`
        : "/api/admin/furniture-interior-decor";

      const method = editingItem ? "PUT" : "POST";

      // Convert empty strings to null for numeric fields
      const sanitizedData = {
        ...data,
        userId,
        role: userRole,
        price: data.price || null,
        originalPrice: data.originalPrice || null,
        rentalPricePerDay: data.rentalPricePerDay || null,
        rentalPricePerWeek: data.rentalPricePerWeek || null,
        rentalPricePerMonth: data.rentalPricePerMonth || null,
        assemblyCharges: data.assemblyCharges || null,
        consultationCharges: data.consultationCharges || null,
        installationCharges: data.installationCharges || null,
        deliveryCharges: data.deliveryCharges || null,
        baseServiceCharge: data.baseServiceCharge || null,
        pricePerSqft: data.pricePerSqft || null,
        minimumOrderValue: data.minimumOrderValue || null,
        advancePaymentPercentage: data.advancePaymentPercentage || null,
        ageInMonths: data.ageInMonths || null,
        seatingCapacity: data.seatingCapacity || null,
        setItems: data.setItems || null,
        returnPeriodDays: data.returnPeriodDays || null,
        stockQuantity: data.stockQuantity || null,
        experienceYears: data.experienceYears || null,
        inquiryCount: data.inquiryCount || null,
        favoriteCount: data.favoriteCount || null,
        rating: data.rating || null,
        reviewCount: data.reviewCount || null,
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
        throw new Error(error.message || `Failed to ${editingItem ? 'update' : 'create'} listing`);
      }

      const result = await response.json();
      console.log(`${editingItem ? 'Updated' : 'Created'} listing:`, result);
      toast({
        title: "Success",
        description: `Listing ${editingItem ? 'updated' : 'created'} successfully!`,
      });
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editingItem ? 'update' : 'create'} listing`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = form.watch("images") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of your furniture/decor listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Modern L-Shape Sofa Set" {...field} />
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
                    <Textarea placeholder="Detailed description of the item..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="decor">Decor</SelectItem>
                        <SelectItem value="furnishing">Furnishing</SelectItem>
                        <SelectItem value="lighting">Lighting</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="custom">Custom Made</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs repair">Needs Repair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., IKEA, Godrej" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sheesham Wood, Fabric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Brown, Grey" {...field} />
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
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="20000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="isNegotiable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Negotiable</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="L x W x H (in cm or inches)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Modern, Traditional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Living Room, Bedroom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="assemblyRequired"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Assembly Required</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyAvailable"
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
                name="billAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Bill Available</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customMade"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Custom Made</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

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
            {images.length > 0 && (
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

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormLabel>Contact Email</FormLabel>
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
            <CardTitle>Location</CardTitle>
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
            </div>

            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Complete address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : editingItem ? "Update Listing" : "Create Listing"}
        </Button>
      </form>
    </Form>
  );
}