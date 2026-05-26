import { useRef, useState } from "react";
import { useUser } from "@/hooks/use-user";
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
import { Plus, Edit, Trash2, Eye, Wrench, X } from "lucide-react";

type ElectricalPlumbingRepairsFormData = {
  title: string;
  description?: string;
  serviceType?: string;
  businessName?: string;

  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;

  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  areaName?: string;

  electricalServices?: boolean;
  plumbingServices?: boolean;
  bothServices?: boolean;

  residentialService?: boolean;
  commercialService?: boolean;
  industrialService?: boolean;

  emergencyService?: boolean;
  onCallService?: boolean;
  AMCService?: boolean;

  newInstallation?: boolean;
  repairService?: boolean;
  maintenanceService?: boolean;
  consultationService?: boolean;

  hourlyRate?: number;
  visitingCharge?: number;
  minimumCharge?: number;

  experienceYears?: number;
  teamSize?: number;
  workingHours?: string;
  availability24x7?: boolean;

  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function ElectricalPlumbingRepairsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<ElectricalPlumbingRepairsFormData>();

  const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  };

  const userId = user?.id || getStoredUser()?.id;
  const role = user?.role || getStoredUser()?.role;

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["electrical-plumbing-repairs", userId || null, role || null],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (userId) query.set('userId', userId);
      if (role) query.set('role', role);
      const url = `/api/admin/electrical-plumbing-repairs${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ElectricalPlumbingRepairsFormData) => {
      const response = await fetch("/api/admin/electrical-plumbing-repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error((error as any)?.message || "Failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electrical-plumbing-repairs"] });
      toast({ title: "Success", description: "Service created" });
      handleCloseDialog();
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ElectricalPlumbingRepairsFormData }) => {
      const response = await fetch(`/api/admin/electrical-plumbing-repairs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error((error as any)?.message || "Failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electrical-plumbing-repairs"] });
      toast({ title: "Success", description: "Updated" });
      handleCloseDialog();
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/electrical-plumbing-repairs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electrical-plumbing-repairs"] });
      toast({ title: "Success", description: "Deleted" });
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    reset();
    setImages([]);
    setImageError(null);
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setImages(item?.images || []);
    Object.keys(item || {}).forEach((key) => {
      setValue(key as any, (item as any)[key]);
    });
    setIsDialogOpen(true);
  };

  const validateImageFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowed.includes(file.type)) return "Only JPG, PNG, WEBP, GIF";
    if (file.size > maxSize) return "Max 5MB";
    return null;
  };

  const uploadImageFiles = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/admin/upload-multiple", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as any)?.message || "Failed");

      const urls: string[] = Array.isArray((json as any)?.files)
        ? (json as any).files.map((f: any) => f?.url).filter((u: any) => typeof u === "string")
        : [];

      if (urls.length === 0) throw new Error("Failed");

      setImages((prev) => [...prev, ...urls].slice(0, 10));
      setImageError(null);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageError(null);

    const remaining = 10 - images.length;
    if (remaining <= 0) {
      setImageError("Max 10");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    for (const f of picked) {
      const err = validateImageFile(f);
      if (err) {
        setImageError(err);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    try {
      await uploadImageFiles(picked);
    } catch (e: any) {
      setImageError(e?.message || "Upload failed");
    }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: ElectricalPlumbingRepairsFormData) => {
    const payload: any = { ...data, images };
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();
    payload.userId = payload.userId || user?.id || stored?.id;
    payload.role = payload.role || user?.role || stored?.role;
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Electrical/Plumbing Repairs</h2>
          <p className="text-muted-foreground">Manage repair service providers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {(items || []).map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Wrench className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.businessName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {item.serviceType && <Badge variant="outline">{item.serviceType}</Badge>}
                          {item.city && <Badge variant="secondary">{item.city}</Badge>}
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {item.isFeatured && <Badge className="bg-green-600">Featured</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p><strong>User ID:</strong> {item.userId || "N/A"}</p>
                          <p><strong>Role:</strong> {item.role || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete?")) deleteMutation.mutate(item.id);
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
            <DialogTitle>{editingItem ? "Edit" : "Add"} Electrical/Plumbing Repair</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input {...register("title", { required: true })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select
                      onValueChange={(v) => setValue("serviceType", v)}
                      defaultValue={editingItem?.serviceType || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input {...register("businessName")} />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea {...register("description")} rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="electricalServices" onCheckedChange={(c) => setValue("electricalServices", c)} />
                    <Label>Electrical Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="plumbingServices" onCheckedChange={(c) => setValue("plumbingServices", c)} />
                    <Label>Plumbing Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="bothServices" onCheckedChange={(c) => setValue("bothServices", c)} />
                    <Label>Both</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="emergencyService" onCheckedChange={(c) => setValue("emergencyService", c)} />
                    <Label>Emergency Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="onCallService" onCheckedChange={(c) => setValue("onCallService", c)} />
                    <Label>On Call</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="AMCService" onCheckedChange={(c) => setValue("AMCService", c)} />
                    <Label>AMC</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Person *</Label>
                    <Input {...register("contactPerson", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input {...register("contactPhone", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" {...register("contactEmail")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input {...register("website")} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="whatsappAvailable" onCheckedChange={(c) => setValue("whatsappAvailable", c)} />
                    <Label>WhatsApp Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input {...register("city", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input {...register("state")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input {...register("country")} />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>Full Address</Label>
                    <Input {...register("fullAddress")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <Label>Upload Images</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        disabled={uploadingImages}
                        onChange={(e) => processFiles(e.target.files)}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">{images.length}/10</div>
                  </div>
                  {imageError && <div className="text-red-600">{imageError}</div>}
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {images.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt="" className="h-20 w-full rounded-md border object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" defaultChecked onCheckedChange={(c) => setValue("isActive", c)} />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" onCheckedChange={(c) => setValue("isFeatured", c)} />
                    <Label>Featured</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {viewingItem && (
        <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingItem.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Business</p>
                <p className="text-sm text-muted-foreground">{viewingItem.businessName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">City</p>
                <p className="text-sm text-muted-foreground">{viewingItem.city}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingItem.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground">{viewingItem.userId || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{viewingItem.role || "N/A"}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
