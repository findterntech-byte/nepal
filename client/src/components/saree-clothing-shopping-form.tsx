import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, X, Pencil, Upload, Camera } from "lucide-react";

// Define the interface for Saree/Clothing/Shopping products
interface SareeClothingFormData {
  title: string;
  description?: string;
  listingType: string;
  category: string;
  subcategory?: string;
  productType?: string;
  brand?: string;
  productName?: string;
  color?: string;
  size?: string;
  material?: string;
  fabricType?: string;
  pattern?: string;
  style?: string;
  occasion?: string;
  sareeType?: string;
  sareeLength?: string;
  blousePieceIncluded?: boolean;
  blousePieceLength?: string;
  borderType?: string;
  palluDesign?: string;
  workType?: string;
  weaveType?: string;
  transparency?: string;
  fallPicoDone?: boolean;
  gender?: string;
  ageGroup?: string;
  fitType?: string;
  sleeveType?: string;
  neckType?: string;
  length?: string;
  waistSize?: string;
  chestSize?: string;
  clothingType?: string;
  isSet?: boolean;
  setIncludes?: string[];
  comboPieces?: number | string;
  dupattaIncluded?: boolean;
  dupattaMaterial?: string;
  price: number | string;
  mrp?: number | string;
  discountPercentage?: number | string;
  rentalPricePerDay?: number | string;
  rentalPricePerWeek?: number | string;
  rentalPricePerMonth?: number | string;
  minimumRentalPeriod?: number | string;
  rentalPeriodUnit?: string;
  securityDeposit?: number | string;
  condition?: string;
  usageDuration?: string;
  purchaseDate?: string;
  ageInMonths?: number | string;
  qualityGrade?: string;
  wearCount?: number | string;
  isOriginal?: boolean;
  handloomCertified?: boolean;
  brandAuthorized?: boolean;
  certificateAvailable?: boolean;
  careInstructions?: string;
  washingInstructions?: string;
  dryCleanOnly?: boolean;
  ironSafe?: boolean;
  machineWashable?: boolean;
  handWashOnly?: boolean;
  inStock?: boolean;
  stockQuantity?: number | string;
  sizesAvailable?: string[];
  colorsAvailable?: string[];
  readyToShip?: boolean;
  madeToOrder?: boolean;
  customizationAvailable?: boolean;
  customSizing?: boolean;
  tailoringIncluded?: boolean;
  stitchingServiceAvailable?: boolean;
  stitchingCharges?: number | string;
  alterationCharges?: number | string;
  images?: string[];
  videos?: string[];
  sizeChart?: string;
  keyFeatures?: string[];
  fabricFeatures?: string[];
  specialFeatures?: string[];
  includedItems?: string[];
  isOnSale?: boolean;
  saleEndDate?: string;
  bankOffers?: string[];
  bulkDiscountAvailable?: boolean;
  minimumOrderQuantity?: number | string;
  wholesaleAvailable?: boolean;
  wholesalePrice?: number | string;
  returnPolicy?: string;
  returnPeriodDays?: number | string;
  replacementPolicy?: string;
  exchangeAvailable?: boolean;
  refundAvailable?: boolean;
  warrantyAvailable?: boolean;
  warrantyPeriod?: string;
  sellerType?: string;
  shopName?: string;
  boutiqueName?: string;
  designerName?: string;
  showroomName?: string;
  contactPerson?: string;
  contactPhone: string;
  contactEmail?: string;
  alternatePhone?: string;
  whatsappAvailable?: boolean;
  whatsappNumber?: string;
  country?: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress?: string;
  deliveryAvailable?: boolean;
  deliveryCharges?: number | string;
  freeDelivery?: boolean;
  freeDeliveryAbove?: number | string;
  sameDayDelivery?: boolean;
  expressDelivery?: boolean;
  codAvailable?: boolean;
  estimatedDeliveryDays?: number | string;
  occasionSuitable?: string[];
  season?: string;
  collectionName?: string;
  launchYear?: number | string;
  limitedEdition?: boolean;
  handcrafted?: boolean;
  handloom?: boolean;
  madeIn?: string;
  originState?: string;
  ecoFriendly?: boolean;
  sustainableFashion?: boolean;
  traditionalWear?: boolean;
  fusionWear?: boolean;
  bridalWear?: boolean;
  partyWear?: boolean;
  casualWear?: boolean;
  formalWear?: boolean;
  ethnicWear?: boolean;
  westernWear?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  availabilityStatus?: string;
}

interface SareeProductApi extends Omit<SareeClothingFormData, 'price' | 'mrp' | 'discountPercentage' | 'rentalPricePerDay' | 'rentalPricePerWeek' | 'rentalPricePerMonth' | 'securityDeposit' | 'stockQuantity' | 'returnPeriodDays' | 'deliveryCharges' | 'freeDeliveryAbove' | 'stitchingCharges' | 'alterationCharges' | 'wholesalePrice' | 'comboPieces' | 'ageInMonths' | 'wearCount' | 'minimumOrderQuantity' | 'minimumRentalPeriod' | 'estimatedDeliveryDays' | 'launchYear'> {
  id: string;
  price: number;
  mrp?: number | null;
  discountPercentage?: number | null;
  rentalPricePerDay?: number | null;
  rentalPricePerWeek?: number | null;
  rentalPricePerMonth?: number | null;
  securityDeposit?: number | null;
  stockQuantity?: number | null;
  returnPeriodDays?: number | null;
  deliveryCharges?: number | null;
  freeDeliveryAbove?: number | null;
  stitchingCharges?: number | null;
  alterationCharges?: number | null;
  wholesalePrice?: number | null;
  comboPieces?: number | null;
  ageInMonths?: number | null;
  wearCount?: number | null;
  minimumOrderQuantity?: number | null;
  minimumRentalPeriod?: number | null;
  estimatedDeliveryDays?: number | null;
  launchYear?: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function SareeClothingShoppingForm(props?: {
  editingItem?: SareeProductApi | null;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { editingItem: externalEditingItem, onSuccess: externalOnSuccess, open: externalOpen, onOpenChange } = props || {};
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(() => {
    if (externalOpen !== undefined) return !!externalOpen;
    if (externalEditingItem) return true;
    return false;
  });
  const [editingItem, setEditingItem] = useState<SareeProductApi | null>(null);
  const [viewingItem, setViewingItem] = useState<SareeProductApi | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const { register, handleSubmit, reset, setValue, watch, control } = useForm<SareeClothingFormData>({
    defaultValues: {
      listingType: "sale",
      category: "saree",
      price: 0,
      mrp: 0,
      discountPercentage: 0,
      rentalPricePerDay: 0,
      rentalPricePerWeek: 0,
      rentalPricePerMonth: 0,
      securityDeposit: 0,
      stockQuantity: 0,
      returnPeriodDays: 0,
      deliveryCharges: 0,
      freeDeliveryAbove: 0,
      stitchingCharges: 0,
      alterationCharges: 0,
      wholesalePrice: 0,
      comboPieces: 0,
      ageInMonths: 0,
      wearCount: 0,
      minimumOrderQuantity: 0,
      minimumRentalPeriod: 0,
      estimatedDeliveryDays: 0,
      launchYear: 0,
      inStock: true,
      isActive: true,
      isFeatured: false,
      deliveryAvailable: true,
      freeDelivery: false,
      sameDayDelivery: false,
      codAvailable: true,
      isOriginal: true,
      exchangeAvailable: true,
      images: [],
      sizesAvailable: [],
      colorsAvailable: [],
      occasionSuitable: [],
      keyFeatures: [],
      fabricFeatures: [],
      specialFeatures: [],
      includedItems: [],
      bankOffers: [],
      setIncludes: [],
    }
  });

  const listingType = watch("listingType");
  const category = watch("category");

  const { data: items = [], isLoading: isLoadingItems } = useQuery<SareeProductApi[]>({
    queryKey: ["saree-clothing-shopping"],
    queryFn: async () => {
      const response = await fetch("/api/admin/saree-clothing-shopping");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch items");
      }
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SareeClothingFormData) => {
      const formattedData = {
        ...data,
        userId,
        role: userRole,
        price: data.price ? parseFloat(data.price.toString()) : 0,
        mrp: data.mrp ? parseFloat(data.mrp.toString()) : null,
        discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage.toString()) : null,
        rentalPricePerDay: data.rentalPricePerDay ? parseFloat(data.rentalPricePerDay.toString()) : null,
        rentalPricePerWeek: data.rentalPricePerWeek ? parseFloat(data.rentalPricePerWeek.toString()) : null,
        rentalPricePerMonth: data.rentalPricePerMonth ? parseFloat(data.rentalPricePerMonth.toString()) : null,
        securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit.toString()) : null,
        stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity.toString()) : null,
        returnPeriodDays: data.returnPeriodDays ? parseInt(data.returnPeriodDays.toString()) : null,
        deliveryCharges: data.deliveryCharges ? parseFloat(data.deliveryCharges.toString()) : null,
        freeDeliveryAbove: data.freeDeliveryAbove ? parseFloat(data.freeDeliveryAbove.toString()) : null,
        stitchingCharges: data.stitchingCharges ? parseFloat(data.stitchingCharges.toString()) : null,
        alterationCharges: data.alterationCharges ? parseFloat(data.alterationCharges.toString()) : null,
        wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice.toString()) : null,
        comboPieces: data.comboPieces ? parseInt(data.comboPieces.toString()) : null,
        ageInMonths: data.ageInMonths ? parseInt(data.ageInMonths.toString()) : null,
        wearCount: data.wearCount ? parseInt(data.wearCount.toString()) : null,
        minimumOrderQuantity: data.minimumOrderQuantity ? parseInt(data.minimumOrderQuantity.toString()) : null,
        minimumRentalPeriod: data.minimumRentalPeriod ? parseInt(data.minimumRentalPeriod.toString()) : null,
        estimatedDeliveryDays: data.estimatedDeliveryDays ? parseInt(data.estimatedDeliveryDays.toString()) : null,
        launchYear: data.launchYear ? parseInt(data.launchYear.toString()) : null,
        images: data.images || [],
        sizesAvailable: data.sizesAvailable || [],
        colorsAvailable: data.colorsAvailable || [],
        occasionSuitable: data.occasionSuitable || [],
        keyFeatures: data.keyFeatures || [],
        fabricFeatures: data.fabricFeatures || [],
        specialFeatures: data.specialFeatures || [],
        includedItems: data.includedItems || [],
        bankOffers: data.bankOffers || [],
        setIncludes: data.setIncludes || [],
      };

      const response = await fetch("/api/admin/saree-clothing-shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create item");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saree-clothing-shopping"] });
      toast({ title: "Success", description: "Item created successfully" });
      handleCloseForm();
      if (externalOnSuccess) externalOnSuccess();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SareeClothingFormData }) => {
      const formattedData = {
        ...data,
        userId,
        role: userRole,
        price: data.price ? parseFloat(data.price.toString()) : 0,
        mrp: data.mrp ? parseFloat(data.mrp.toString()) : null,
        discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage.toString()) : null,
        rentalPricePerDay: data.rentalPricePerDay ? parseFloat(data.rentalPricePerDay.toString()) : null,
        rentalPricePerWeek: data.rentalPricePerWeek ? parseFloat(data.rentalPricePerWeek.toString()) : null,
        rentalPricePerMonth: data.rentalPricePerMonth ? parseFloat(data.rentalPricePerMonth.toString()) : null,
        securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit.toString()) : null,
        stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity.toString()) : null,
        returnPeriodDays: data.returnPeriodDays ? parseInt(data.returnPeriodDays.toString()) : null,
        deliveryCharges: data.deliveryCharges ? parseFloat(data.deliveryCharges.toString()) : null,
        freeDeliveryAbove: data.freeDeliveryAbove ? parseFloat(data.freeDeliveryAbove.toString()) : null,
        stitchingCharges: data.stitchingCharges ? parseFloat(data.stitchingCharges.toString()) : null,
        alterationCharges: data.alterationCharges ? parseFloat(data.alterationCharges.toString()) : null,
        wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice.toString()) : null,
        comboPieces: data.comboPieces ? parseInt(data.comboPieces.toString()) : null,
        ageInMonths: data.ageInMonths ? parseInt(data.ageInMonths.toString()) : null,
        wearCount: data.wearCount ? parseInt(data.wearCount.toString()) : null,
        minimumOrderQuantity: data.minimumOrderQuantity ? parseInt(data.minimumOrderQuantity.toString()) : null,
        minimumRentalPeriod: data.minimumRentalPeriod ? parseInt(data.minimumRentalPeriod.toString()) : null,
        estimatedDeliveryDays: data.estimatedDeliveryDays ? parseInt(data.estimatedDeliveryDays.toString()) : null,
        launchYear: data.launchYear ? parseInt(data.launchYear.toString()) : null,
        images: data.images || [],
        sizesAvailable: data.sizesAvailable || [],
        colorsAvailable: data.colorsAvailable || [],
        occasionSuitable: data.occasionSuitable || [],
        keyFeatures: data.keyFeatures || [],
        fabricFeatures: data.fabricFeatures || [],
        specialFeatures: data.specialFeatures || [],
        includedItems: data.includedItems || [],
        bankOffers: data.bankOffers || [],
        setIncludes: data.setIncludes || [],
      };
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saree-clothing-shopping"] });
      toast({ title: "Success", description: "Item updated successfully" });
      handleCloseForm();
      if (externalOnSuccess) externalOnSuccess();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saree-clothing-shopping"] });
      toast({ title: "Success", description: "Item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: SareeClothingFormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: SareeProductApi) => {
    setEditingItem(item);
    Object.keys(item).forEach((key) => {
      const value = item[key as keyof SareeProductApi];
      if (typeof value === 'number' && value !== null) {
        setValue(key as keyof SareeClothingFormData, value.toString());
      } else if (value !== null && value !== undefined) {
        setValue(key as keyof SareeClothingFormData, value);
      }
    });
    setValue("inStock", item.inStock ?? true);
    setValue("isActive", item.isActive ?? true);
    setValue("isFeatured", item.isFeatured ?? false);
    setValue("deliveryAvailable", item.deliveryAvailable ?? true);
    setValue("freeDelivery", item.freeDelivery ?? false);
    setValue("sameDayDelivery", item.sameDayDelivery ?? false);
    setValue("codAvailable", item.codAvailable ?? true);
    setValue("isOriginal", item.isOriginal ?? true);
    setValue("exchangeAvailable", item.exchangeAvailable ?? true);
    setValue("blousePieceIncluded", item.blousePieceIncluded ?? false);
    setValue("fallPicoDone", item.fallPicoDone ?? false);
    setShowForm(true);
  };

  // If external editingItem prop is provided, open the form and populate
  useEffect(() => {
    if (externalEditingItem) {
      handleEdit(externalEditingItem);
    }
  }, [externalEditingItem]);

  // If external open prop is controlled, sync local showForm
  useEffect(() => {
    if (externalOpen !== undefined) setShowForm(!!externalOpen);
  }, [externalOpen]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    reset();
    if (onOpenChange) onOpenChange(false);
  };

  const handleView = (item: SareeProductApi) => {
    setViewingItem(item);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await processFiles(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFiles = async (files: FileList) => {
    setUploadingImages(true);
    setImagePreviewError(null);
    const accepted: File[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file size
        if (file.size > maxFileSize) {
          setImagePreviewError(`File ${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          setImagePreviewError(`File ${file.name} is not a valid image format. Please use JPEG, PNG, WebP, or GIF.`);
          continue;
        }

        accepted.push(file);
      }

      if (accepted.length > 0) {
        const currentImages = watch("images") || [];
        const totalImages = currentImages.length + accepted.length;

        if (totalImages > 10) {
          setImagePreviewError(`Maximum 10 images allowed. You can upload ${10 - currentImages.length} more image(s).`);
          return;
        }

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

        const uploadedUrls = await uploadMultipleFiles(accepted);

        setValue("images", [...currentImages, ...uploadedUrls]);

        toast({
          title: "Success",
          description: `${uploadedUrls.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      setImagePreviewError("Failed to process images. Please try again.");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = watch("images") || [];
    setValue("images", currentImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saree, Clothing & Shopping</CardTitle>
              <CardDescription>Manage saree, clothing, and shopping products</CardDescription>
            </div>
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingItem(null);
                  reset();
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </CardHeader>

        {showForm ? (
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-pink-50 to-purple-50">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="seller">Seller</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title *</Label>
                      <Input id="title" {...register("title", { required: true })} placeholder="Enter product title" />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" {...register("description")} rows={3} placeholder="Describe your product..." />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="listingType">Listing Type *</Label>
                        <Select onValueChange={(value) => setValue("listingType", value)} defaultValue={editingItem?.listingType || "sale"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="rent">Rent</SelectItem>
                            <SelectItem value="exchange">Exchange</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={(value) => setValue("category", value)} defaultValue={editingItem?.category || "saree"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saree">Saree</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="ethnic-wear">Ethnic Wear</SelectItem>
                            <SelectItem value="western-wear">Western Wear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input id="subcategory" {...register("subcategory")} placeholder="e.g., Cotton Sarees" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" {...register("brand")} placeholder="Brand name" />
                      </div>

                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input id="productName" {...register("productName")} placeholder="Product name" />
                      </div>

                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" {...register("color")} placeholder="e.g., Red, Blue" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="images" className="text-base font-semibold mb-3 block">Product Images</Label>
                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                            dragActive
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-300 bg-gray-50 hover:border-pink-400 hover:bg-pink-50'
                          } ${uploadingImages ? 'opacity-60 pointer-events-none' : ''}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Input
                            ref={fileInputRef}
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImages}
                          />
                          <div className="flex flex-col items-center gap-2">
                            {uploadingImages ? (
                              <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                                <p className="text-sm text-muted-foreground">Uploading images...</p>
                              </>
                            ) : (
                              <>
                                <Camera className="w-10 h-10 text-pink-500 mx-auto" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Drag and drop images here
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    or click to select files (Max 5MB each, up to 10 images)
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {imagePreviewError && (
                          <p className="text-xs text-red-500 mt-2">{imagePreviewError}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Supported: JPEG, PNG, WebP, GIF
                        </p>
                      </div>
                    </div>

                    {watch("images") && watch("images")!.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">
                            Uploaded Images ({watch("images")!.length}/10)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImages || (watch("images")?.length || 0) >= 10}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add More
                          </Button>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                          {watch("images")!.map((img: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Product ${idx + 1}`}
                                className="w-full h-24  rounded-lg border-2 border-pink-200 hover:border-pink-400 transition-colors"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(idx)}
                                  title={`Remove image ${idx + 1}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="absolute top-1 left-1 bg-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                {idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="size">Size</Label>
                        <Input id="size" {...register("size")} placeholder="e.g., M, L, XL" />
                      </div>

                      <div>
                        <Label htmlFor="material">Material</Label>
                        <Input id="material" {...register("material")} placeholder="e.g., Cotton, Silk" />
                      </div>

                      <div>
                        <Label htmlFor="fabricType">Fabric Type</Label>
                        <Input id="fabricType" {...register("fabricType")} placeholder="Fabric type" />
                      </div>
                    </div>

                    {category === "saree" && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="sareeType">Saree Type</Label>
                            <Select onValueChange={(value) => setValue("sareeType", value)} defaultValue={editingItem?.sareeType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="banarasi">Banarasi</SelectItem>
                                <SelectItem value="kanjivaram">Kanjivaram</SelectItem>
                                <SelectItem value="silk">Silk</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="georgette">Georgette</SelectItem>
                                <SelectItem value="chiffon">Chiffon</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="sareeLength">Saree Length</Label>
                            <Input id="sareeLength" {...register("sareeLength")} placeholder="e.g., 5.5m" />
                          </div>

                          <div>
                            <Label htmlFor="borderType">Border Type</Label>
                            <Input id="borderType" {...register("borderType")} placeholder="Border type" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="blousePieceIncluded"
                              onCheckedChange={(checked) => setValue("blousePieceIncluded", checked)}
                              defaultChecked={!!editingItem?.blousePieceIncluded}
                            />
                            <Label htmlFor="blousePieceIncluded">Blouse Piece Included</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="fallPicoDone"
                              onCheckedChange={(checked) => setValue("fallPicoDone", checked)}
                              defaultChecked={!!editingItem?.fallPicoDone}
                            />
                            <Label htmlFor="fallPicoDone">Fall & Pico Done</Label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => setValue("gender", value)} defaultValue={editingItem?.gender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <Select onValueChange={(value) => setValue("condition", value)} defaultValue={editingItem?.condition}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like_new">Like New</SelectItem>
                            <SelectItem value="gently_used">Gently Used</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="occasion">Occasion</Label>
                        <Input id="occasion" {...register("occasion")} placeholder="e.g., Wedding, Party" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          {...register("price", { required: true })}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mrp">MRP (₹)</Label>
                        <Input id="mrp" type="number" step="0.01" {...register("mrp")} placeholder="0.00" />
                      </div>

                      <div>
                        <Label htmlFor="discountPercentage">Discount %</Label>
                        <Input
                          id="discountPercentage"
                          type="number"
                          step="0.01"
                          {...register("discountPercentage")}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {listingType === "rent" && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="rentalPricePerDay">Rental/Day (₹)</Label>
                          <Input
                            id="rentalPricePerDay"
                            type="number"
                            step="0.01"
                            {...register("rentalPricePerDay")}
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="rentalPricePerWeek">Rental/Week (₹)</Label>
                          <Input
                            id="rentalPricePerWeek"
                            type="number"
                            step="0.01"
                            {...register("rentalPricePerWeek")}
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                          <Input
                            id="securityDeposit"
                            type="number"
                            step="0.01"
                            {...register("securityDeposit")}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inStock"
                          onCheckedChange={(checked) => setValue("inStock", checked)}
                          defaultChecked={editingItem ? (editingItem.inStock !== undefined ? editingItem.inStock : true) : true}
                        />
                        <Label htmlFor="inStock">In Stock</Label>
                      </div>

                      <div>
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input id="stockQuantity" type="number" {...register("stockQuantity")} placeholder="0" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isOriginal"
                          onCheckedChange={(checked) => setValue("isOriginal", checked)}
                          defaultChecked={editingItem ? (editingItem.isOriginal !== undefined ? editingItem.isOriginal : true) : true}
                        />
                        <Label htmlFor="isOriginal">Original Product</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="handloomCertified"
                          onCheckedChange={(checked) => setValue("handloomCertified", checked)}
                          defaultChecked={editingItem ? (editingItem.handloomCertified !== undefined ? editingItem.handloomCertified : false) : false}
                        />
                        <Label htmlFor="handloomCertified">Handloom Certified</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="customizationAvailable"
                          onCheckedChange={(checked) => setValue("customizationAvailable", checked)}
                          defaultChecked={editingItem ? (editingItem.customizationAvailable !== undefined ? editingItem.customizationAvailable : false) : false}
                        />
                        <Label htmlFor="customizationAvailable">Customization Available</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="exchangeAvailable"
                          onCheckedChange={(checked) => setValue("exchangeAvailable", checked)}
                          defaultChecked={editingItem ? (editingItem.exchangeAvailable !== undefined ? editingItem.exchangeAvailable : true) : true}
                        />
                        <Label htmlFor="exchangeAvailable">Exchange Available</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="careInstructions">Care Instructions</Label>
                      <Textarea id="careInstructions" {...register("careInstructions")} rows={3} placeholder="Care instructions..." />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seller" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shopName">Shop Name</Label>
                        <Input id="shopName" {...register("shopName")} placeholder="Shop name" />
                      </div>

                      <div>
                        <Label htmlFor="boutiqueName">Boutique Name</Label>
                        <Input id="boutiqueName" {...register("boutiqueName")} placeholder="Boutique name" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input id="contactPerson" {...register("contactPerson")} placeholder="Contact person" />
                      </div>

                      <div>
                        <Label htmlFor="contactPhone">Contact Phone *</Label>
                        <Input
                          id="contactPhone"
                          {...register("contactPhone", { required: true })}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} placeholder="City" />
                      </div>

                      <div>
                        <Label htmlFor="areaName">Area</Label>
                        <Input id="areaName" {...register("areaName")} placeholder="Area" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="delivery" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="deliveryAvailable"
                          onCheckedChange={(checked) => setValue("deliveryAvailable", checked)}
                          defaultChecked={editingItem ? (editingItem.deliveryAvailable !== undefined ? editingItem.deliveryAvailable : false) : false}
                        />
                        <Label htmlFor="deliveryAvailable">Delivery Available</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="freeDelivery"
                          onCheckedChange={(checked) => setValue("freeDelivery", checked)}
                          defaultChecked={editingItem ? (editingItem.freeDelivery !== undefined ? editingItem.freeDelivery : false) : false}
                        />
                        <Label htmlFor="freeDelivery">Free Delivery</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sameDayDelivery"
                          onCheckedChange={(checked) => setValue("sameDayDelivery", checked)}
                          defaultChecked={editingItem ? (editingItem.sameDayDelivery !== undefined ? editingItem.sameDayDelivery : false) : false}
                        />
                        <Label htmlFor="sameDayDelivery">Same Day Delivery</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="codAvailable"
                          onCheckedChange={(checked) => setValue("codAvailable", checked)}
                          defaultChecked={editingItem ? (editingItem.codAvailable !== undefined ? editingItem.codAvailable : true) : true}
                        />
                        <Label htmlFor="codAvailable">COD Available</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryCharges">Delivery Charges (₹)</Label>
                        <Input
                          id="deliveryCharges"
                          type="number"
                          step="0.01"
                          {...register("deliveryCharges")}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="freeDeliveryAbove">Free Delivery Above (₹)</Label>
                        <Input
                          id="freeDeliveryAbove"
                          type="number"
                          step="0.01"
                          {...register("freeDeliveryAbove")}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeTab === 'basic'}
                  onClick={() => {
                    const steps = ['basic', 'details', 'pricing', 'features', 'seller', 'delivery'];
                    const idx = steps.indexOf(activeTab);
                    setActiveTab(steps[Math.max(0, idx - 1)]);
                  }}
                >
                  Previous
                </Button>

                {activeTab !== 'delivery' ? (
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    onClick={() => {
                      const steps = ['basic', 'details', 'pricing', 'features', 'seller', 'delivery'];
                      const idx = steps.indexOf(activeTab);
                      setActiveTab(steps[Math.min(steps.length - 1, idx + 1)]);
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingItem ? "Update Product" : "Create Product"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            {isLoadingItems ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first product</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge variant={item.inStock ? "default" : "secondary"}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingItem?.title}</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              {viewingItem.images && viewingItem.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {viewingItem.images.map((img, index) => (
                    <img key={index} src={img} alt={`Product image ${index + 1}`} className="w-24 h-24  rounded-md border" />
                  ))}
                </div>
              )}
              <div className="text-muted-foreground">{viewingItem.description}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Listing Type:</Label>
                  <p>{viewingItem.listingType}</p>
                </div>
                <div>
                  <Label>Category:</Label>
                  <p>{viewingItem.category}</p>
                </div>
                <div>
                  <Label>Price:</Label>
                  <p className="text-2xl font-bold text-pink-600">₹{Number(viewingItem.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <Label>Contact Phone:</Label>
                  <p>{viewingItem.contactPhone}</p>
                </div>
                {viewingItem.brand && (
                  <div>
                    <Label>Brand:</Label>
                    <p>{viewingItem.brand}</p>
                  </div>
                )}
                {viewingItem.color && (
                  <div>
                    <Label>Color:</Label>
                    <p>{viewingItem.color}</p>
                  </div>
                )}
                {(viewingItem.city || viewingItem.areaName) && (
                  <div>
                    <Label>Location:</Label>
                    <p>{[viewingItem.areaName, viewingItem.city].filter(Boolean).join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}