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

interface HostelPgFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostelPg?: any;
  onSuccess: () => void;
}

export function HostelPgForm({ open, onOpenChange, hostelPg, onSuccess }: HostelPgFormProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerMonth: "",
    hostelType: "boys",
    roomType: "single",
    totalBeds: "",
    availableBeds: "",
    facilities: [] as string[],
    foodIncluded: false,
    images: [] as string[],
    rules: "",
    country: "",
    stateProvince: "",
    city: "",
    area: "",
    fullAddress: "",
    contactPerson: "",
    contactPhone: "",
    isActive: true,
    isFeatured: false,
  });

  const [newFacility, setNewFacility] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(String(s || '').trim());

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const [meta, content] = String(dataUrl || '').split(',');
    const match = /data:([^;]+);base64/i.exec(meta || '');
    const mime = match?.[1] || 'application/octet-stream';
    const binary = atob(content || '');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const url = data?.url;
    if (typeof url !== 'string' || url.length === 0) throw new Error('Upload failed: missing url');
    return url;
  };

  const ensureUploadedImageUrls = async (items: string[]): Promise<string[]> => {
    const out: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const v = items[i];
      if (typeof v !== 'string' || v.length === 0) continue;
      if (!isDataMediaUrl(v)) {
        out.push(v);
        continue;
      }
      const file = dataUrlToFile(v, `image-${Date.now()}-${i}.png`);
      const url = await uploadSingleFile(file);
      out.push(url);
    }
    return out;
  };

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
    if (hostelPg) {
      setFormData({
        name: hostelPg.name || "",
        description: hostelPg.description || "",
        pricePerMonth: hostelPg.pricePerMonth || "",
        hostelType: hostelPg.hostelType || "boys",
        roomType: hostelPg.roomType || "single",
        totalBeds: hostelPg.totalBeds || "",
        availableBeds: hostelPg.availableBeds || "",
        facilities: hostelPg.facilities || [],
        foodIncluded: hostelPg.foodIncluded || false,
        images: hostelPg.images || [],
        rules: hostelPg.rules || "",
        country: hostelPg.country || "",
        stateProvince: hostelPg.stateProvince || "",
        city: hostelPg.city || "",
        area: hostelPg.area || "",
        fullAddress: hostelPg.fullAddress || "",
        contactPerson: hostelPg.contactPerson || "",
        contactPhone: hostelPg.contactPhone || "",
        isActive: hostelPg.isActive ?? true,
        isFeatured: hostelPg.isFeatured || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        pricePerMonth: "",
        hostelType: "boys",
        roomType: "single",
        totalBeds: "",
        availableBeds: "",
        facilities: [],
        foodIncluded: false,
        images: [],
        rules: "",
        country: "",
        stateProvince: "",
        city: "",
        area: "",
        fullAddress: "",
        contactPerson: "",
        contactPhone: "",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [hostelPg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate userId and role
    if (!userId || !userRole) {
      alert("User information not found. Please login again.");
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      alert("Please enter a name for the hostel/PG");
      return;
    }

    if (!formData.pricePerMonth || formData.pricePerMonth === "") {
      alert("Please enter the price per month");
      return;
    }

    if (!formData.totalBeds || formData.totalBeds === "") {
      alert("Please enter the total number of beds");
      return;
    }

    if (!formData.availableBeds || formData.availableBeds === "") {
      alert("Please enter the number of available beds");
      return;
    }

    if (!formData.stateProvince || !formData.stateProvince.trim()) {
      alert("Please enter the state/province");
      return;
    }

    if (!formData.city || !formData.city.trim()) {
      alert("Please enter the city");
      return;
    }

    if (!formData.area || !formData.area.trim()) {
      alert("Please enter the area");
      return;
    }

    if (!formData.fullAddress || !formData.fullAddress.trim()) {
      alert("Please enter the full address");
      return;
    }

    if (!formData.contactPerson || !formData.contactPerson.trim()) {
      alert("Please enter the contact person name");
      return;
    }

    if (!formData.contactPhone || !formData.contactPhone.trim()) {
      alert("Please enter the contact phone number");
      return;
    }

    try {
      const safeImages = await ensureUploadedImageUrls(formData.images);
      if (safeImages.length !== formData.images.length) {
        setFormData((prev) => ({ ...prev, images: safeImages }));
      }

      const url = hostelPg
        ? `/api/admin/hostel-pg/${hostelPg.id}`
        : "/api/admin/hostel-pg";
      const method = hostelPg ? "PUT" : "POST";

      const dataToSubmit = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        pricePerMonth: formData.pricePerMonth,
        hostelType: formData.hostelType,
        roomType: formData.roomType,
        totalBeds: formData.totalBeds,
        availableBeds: formData.availableBeds,
        facilities: formData.facilities,
        foodIncluded: formData.foodIncluded,
        images: safeImages,
        rules: formData.rules?.trim() || "",
        country: formData.country?.trim() || "India",
        stateProvince: formData.stateProvince.trim(),
        city: formData.city.trim(),
        area: formData.area.trim(),
        fullAddress: formData.fullAddress.trim(),
        contactPerson: formData.contactPerson.trim(),
        contactPhone: formData.contactPhone.trim(),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        userId: userId,
        role: userRole,
        ownerId: userId,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save hostel/PG");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving hostel/PG:", error);
      alert(error.message || "Failed to save hostel/PG. Please check all required fields.");
    }
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()],
      });
      setNewFacility("");
    }
  };

  const removeFacility = (index: number) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 10 * 1024 * 1024;
      const accepted: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!allowed.includes(f.type)) {
          setImageError('Only JPG, PNG, WEBP and GIF allowed');
          continue;
        }
        if (f.size > maxSize) {
          setImageError('Each image must be <= 10MB');
          continue;
        }
        accepted.push(f);
      }

      if (accepted.length === 0) return;

      const fd = new FormData();
      accepted.forEach((f) => fd.append('files', f));
      const res = await fetch('/api/upload-multiple', { method: 'POST', body: fd });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({} as any));
        throw new Error(msg?.message || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      const urls = Array.isArray(data?.files)
        ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === 'string')
        : [];
      if (urls.length === 0) throw new Error('Upload failed: missing files');

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      setImageError(null);
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageError(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      e.target.value = "";
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
          <DialogTitle>{hostelPg ? "Edit Hostel/PG" : "Add Hostel/PG"}</DialogTitle>
          <DialogDescription>
            {hostelPg ? "Update hostel/PG details" : "Create a new hostel/PG listing"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="pricePerMonth">Price Per Month *</Label>
              <Input
                id="pricePerMonth"
                type="number"
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="hostelType">Hostel Type *</Label>
              <Select
                value={formData.hostelType}
                onValueChange={(value) => setFormData({ ...formData, hostelType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="coed">Co-ed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="roomType">Room Type *</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData({ ...formData, roomType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                  <SelectItem value="dormitory">Dormitory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalBeds">Total Beds</Label>
              <Input
                id="totalBeds"
                type="number"
                value={formData.totalBeds}
                onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="availableBeds">Available Beds</Label>
              <Input
                id="availableBeds"
                type="number"
                value={formData.availableBeds}
                onChange={(e) => setFormData({ ...formData, availableBeds: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., Nepal"
              />
            </div>

            <div>
              <Label htmlFor="stateProvince">State/Province *</Label>
              <Input
                id="stateProvince"
                value={formData.stateProvince}
                onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                placeholder="e.g., Bagmati"
                required
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Kathmandu"
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Thamel"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="fullAddress">Full Address *</Label>
              <Textarea
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                placeholder="Enter complete address"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                rows={3}
                placeholder="Enter hostel rules and regulations"
              />
            </div>

            <div className="col-span-2">
              <Label>Facilities</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="Add facility (e.g., WiFi, Laundry)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                />
                <Button type="button" onClick={addFacility} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {facility}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFacility(index)}
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
                    id="hostel-image-upload"
                    disabled={uploadingImage}
                  />
                  <label 
                    htmlFor="hostel-image-upload" 
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
                {imageError && (
                  <div className="text-sm text-red-600">{imageError}</div>
                )}
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
                id="foodIncluded"
                checked={formData.foodIncluded}
                onCheckedChange={(checked) => setFormData({ ...formData, foodIncluded: checked })}
              />
              <Label htmlFor="foodIncluded">Food Included</Label>
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
              {hostelPg ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}