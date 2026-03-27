import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ConstructionMaterialsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: any;
  onSuccess: () => void;
}

export function ConstructionMaterialsForm({ open, onOpenChange, material, onSuccess }: ConstructionMaterialsFormProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    unit: "",
    brand: "",
    specifications: {} as Record<string, string>,
    images: [] as string[],
    supplierId: "",
    supplierName: "",
    supplierContact: "",
    stockStatus: "in_stock",
    minimumOrder: "",
    country: "India",
    stateProvince: "",
    city: "",
    area: "",
    fullAddress: "",
    isActive: true,
    isFeatured: false,
  });

  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Try to get from localStorage first
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

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || "",
        category: material.category || "",
        description: material.description || "",
        price: material.price || "",
        unit: material.unit || "",
        brand: material.brand || "",
        specifications: material.specifications || {},
        images: material.images || [],
        supplierId: material.supplierId || "",
        supplierName: material.supplierName || "",
        supplierContact: material.supplierContact || "",
        stockStatus: material.stockStatus || "in_stock",
        minimumOrder: material.minimumOrder || "",
        country: material.country || "India",
        stateProvince: material.stateProvince || "",
        city: material.city || "",
        area: material.area || "",
        fullAddress: material.fullAddress || "",
        isActive: material.isActive ?? true,
        isFeatured: material.isFeatured || false,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        unit: "",
        brand: "",
        specifications: {},
        images: [],
        supplierId: "",
        supplierName: "",
        supplierContact: "",
        stockStatus: "in_stock",
        minimumOrder: "",
        country: "India",
        stateProvince: "",
        city: "",
        area: "",
        fullAddress: "",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate userId and role
    if (!userId || !userRole) {
      alert("User information not found. Please login again.");
      return;
    }

    try {
      const url = material
        ? `/api/admin/construction-materials/${material.id}`
        : "/api/admin/construction-materials";
      const method = material ? "PUT" : "POST";

      // Clean up the data - convert empty strings to null for numeric fields
      const cleanedData = {
        ...formData,
        userId: userId,
        role: userRole,
        // Convert empty strings to null for numeric fields
        price: formData.price || null,
        minimumOrder: formData.minimumOrder || null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save construction material");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving construction material:", error);
      alert("An error occurred while saving the construction material.");
    }
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      });
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    const { [key]: _, ...rest } = formData.specifications;
    setFormData({
      ...formData,
      specifications: rest,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    e.currentTarget.value = "";

    setUploadingImage(true);
    try {
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

      const uploadedUrls = await uploadMultipleFiles(selectedFiles);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material ? "Edit Construction Material" : "Add Construction Material"}</DialogTitle>
          <DialogDescription>
            {material ? "Update construction material details" : "Create a new construction material listing"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Material Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Portland Cement"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cement">Cement</SelectItem>
                  <SelectItem value="steel">Steel & Iron</SelectItem>
                  <SelectItem value="bricks">Bricks & Blocks</SelectItem>
                  <SelectItem value="sand">Sand & Aggregates</SelectItem>
                  <SelectItem value="paint">Paint & Coatings</SelectItem>
                  <SelectItem value="tiles">Tiles & Flooring</SelectItem>
                  <SelectItem value="wood">Wood & Timber</SelectItem>
                  <SelectItem value="plumbing">Plumbing Materials</SelectItem>
                  <SelectItem value="electrical">Electrical Materials</SelectItem>
                  <SelectItem value="hardware">Hardware & Tools</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., ACC, Ultratech"
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="sqft">Square Feet</SelectItem>
                  <SelectItem value="sqm">Square Meter</SelectItem>
                  <SelectItem value="cft">Cubic Feet</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="meter">Meter</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minimumOrder">Minimum Order Quantity</Label>
              <Input
                id="minimumOrder"
                type="number"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <Label htmlFor="stockStatus">Stock Status *</Label>
              <Select
                value={formData.stockStatus}
                onValueChange={(value) => setFormData({ ...formData, stockStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="on_order">On Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Detailed description of the material"
              />
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-semibold mb-3 pt-4 border-t">Location Details</h3>
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., India"
                required
              />
            </div>

            <div>
              <Label htmlFor="stateProvince">State/Province *</Label>
              <Input
                id="stateProvince"
                value={formData.stateProvince}
                onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                placeholder="e.g., Rajasthan"
                required
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Jaipur"
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Malviya Nagar"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="fullAddress">Full Address *</Label>
              <Textarea
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                rows={2}
                placeholder="Enter complete address"
                required
              />
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-semibold mb-3 pt-4 border-t">Supplier Information</h3>
            </div>

            <div className="col-span-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                placeholder="Supplier or distributor name"
              />
            </div>

            <div>
              <Label htmlFor="supplierContact">Supplier Contact</Label>
              <Input
                id="supplierContact"
                value={formData.supplierContact}
                onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                placeholder="Phone or email"
              />
            </div>

            <div>
              <Label htmlFor="supplierId">Supplier ID</Label>
              <Input
                id="supplierId"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                placeholder="Internal supplier ID"
              />
            </div>

            <div className="col-span-2">
              <Label>Specifications</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Key (e.g., Grade)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecification())}
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g., 53)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecification())}
                />
                <Button type="button" onClick={addSpecification} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {key}: {value}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeSpecification(key)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <Label>Images</Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="material-image-upload"
                    disabled={uploadingImage}
                  />
                  <label 
                    htmlFor="material-image-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploadingImage ? (
                      <div className="text-sm text-gray-600">Uploading...</div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Click to upload images or drag and drop</span>
                        <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</span>
                      </>
                    )}
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24  rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {material ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}