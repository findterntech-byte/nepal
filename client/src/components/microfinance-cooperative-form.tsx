import { useState, useRef } from "react";
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
import { Plus, Edit, Trash2, Eye, Landmark, X } from "lucide-react";

type MicrofinanceCooperativeFormData = {
  title: string;
  description?: string;
  organizationType: string;
  organizationName: string;
  registrationNumber?: string;
  establishedYear?: number;
  headOffice?: string;
  branches?: number;
  members?: number;
  sector?: string;
  services?: string;
  targetAudience?: string;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  interestRate?: string;
  processingFee?: string;
  collateralRequired?: boolean;
  governmentRegistered?: boolean;
  rbiApproved?: boolean;
  sebiRegistered?: boolean;
  nbfcCertified?: boolean;
  shgFinance?: boolean;
  womenEmpowerment?: boolean;
  farmerFinance?: boolean;
  startupFunding?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  website?: string;
  whatsappAvailable?: boolean;
  city?: string;
  fullAddress: string;
  workingHours?: string;
  available24_7?: boolean;
  languagesKnown?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: string[];
};


export default function MicrofinanceCooperativeForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<MicrofinanceCooperativeFormData>();

  const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  };

  const userId = user?.id || getStoredUser()?.id;
  const role = user?.role || getStoredUser()?.role;

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["microfinance-cooperative", userId || null, role || null],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (userId) query.set('userId', userId);
      if (role) query.set('role', role);
      const url = `/api/admin/microfinance-cooperative${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MicrofinanceCooperativeFormData) => {
      const response = await fetch("/api/admin/microfinance-cooperative", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["microfinance-cooperative"] }); toast({ title: "Success", description: "Organization created" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MicrofinanceCooperativeFormData }) => {
      const response = await fetch(`/api/admin/microfinance-cooperative/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || "Failed"); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["microfinance-cooperative"] }); toast({ title: "Success", description: "Updated" }); handleCloseDialog(); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/microfinance-cooperative/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["microfinance-cooperative"] }); toast({ title: "Success", description: "Deleted" }); },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); setImageError(null); setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const handleEdit = (service: any) => { setEditingService(service); setImages(service.images || []); Object.keys(service).forEach((key) => { setValue(key as any, service[key]); }); setIsDialogOpen(true); };

  const validateImageFile = (file: File) => { const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]; const maxSize = 5 * 1024 * 1024; if (!allowed.includes(file.type)) return "Only JPG, PNG, WEBP, GIF"; if (file.size > maxSize) return "Max 5MB"; return null; };

  const uploadImageFiles = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const formData = new FormData(); files.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/admin/upload-multiple", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as any)?.message || "Failed");
      const urls: string[] = Array.isArray((json as any)?.files) ? (json as any).files.map((f: any) => f?.url).filter((u: any) => typeof u === "string") : [];
      if (urls.length === 0) throw new Error("Failed");
      setImages((prev) => [...prev, ...urls].slice(0, 10)); setImageError(null);
    } finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return; setImageError(null);
    const remaining = 10 - images.length; if (remaining <= 0) { setImageError("Max 10"); if (fileInputRef.current) fileInputRef.current.value = ""; return; }
    const picked = Array.from(files).slice(0, remaining);
    for (const f of picked) { const err = validateImageFile(f); if (err) { setImageError(err); if (fileInputRef.current) fileInputRef.current.value = ""; return; } }
    try { await uploadImageFiles(picked); } catch (e: any) { setImageError(e?.message || "Upload failed"); }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: MicrofinanceCooperativeFormData) => {
    const payload: any = { ...data, images };
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();
    payload.userId = payload.userId || user?.id || stored?.id;
    payload.role = payload.role || user?.role || stored?.role;
    if (editingService) { updateMutation.mutate({ id: editingService.id, data: payload }); } else { createMutation.mutate(payload); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Microfinance & Cooperative Listings</h2>
          <p className="text-muted-foreground">Manage microfinance and cooperative organizations</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Organization</Button>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <Landmark className="h-5 w-5 text-cyan-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.organizationName}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{service.organizationType}</Badge>
                          {service.governmentRegistered && <Badge className="bg-green-600">Gov Registered</Badge>}
                          {service.nbfcCertified && <Badge className="bg-blue-600">NBFC</Badge>}
                          {service.rbiApproved && <Badge className="bg-purple-600">RBI Approved</Badge>}
                        </div>
                        {service.members && <p className="text-sm text-muted-foreground mt-2">Members: {service.members.toLocaleString()}</p>}
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p><strong>User ID:</strong> {service.userId || "N/A"}</p>
                          <p><strong>Role:</strong> {service.role || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingService(service)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(service.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? "Edit" : "Add"} Microfinance/Cooperative</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
                  <div className="space-y-2">
                    <Label>Organization Type *</Label>
                    <Select onValueChange={(v) => setValue("organizationType", v)} defaultValue={editingService?.organizationType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="microfinance_company">Microfinance Company</SelectItem>
                        <SelectItem value="nbfc">NBFC (Non-Banking Finance Company)</SelectItem>
                        <SelectItem value="cooperative_bank">Cooperative Bank</SelectItem>
                        <SelectItem value="credit_society">Credit Society</SelectItem>
                        <SelectItem value="primary_agricultural_credit_society">PACS</SelectItem>
                        <SelectItem value="self_help_group">Self Help Group (SHG)</SelectItem>
                        <SelectItem value="women_self_help_group">Women SHG</SelectItem>
                        <SelectItem value="farmer_producer_company">Farmer Producer Company</SelectItem>
                        <SelectItem value="housing_finance_company">Housing Finance Company</SelectItem>
                        <SelectItem value="startup_fund">Startup Fund</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Organization Name *</Label><Input {...register("organizationName", { required: true })} /></div>
                  <div className="space-y-2"><Label>Registration Number</Label><Input {...register("registrationNumber")} /></div>
                  <div className="space-y-2"><Label>Established Year</Label><Input type="number" {...register("establishedYear", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Head Office</Label><Input {...register("headOffice")} /></div>
                  <div className="space-y-2"><Label>Number of Branches</Label><Input type="number" {...register("branches", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Number of Members</Label><Input type="number" {...register("members", { valueAsNumber: true })} /></div>
                  <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Services & Focus Areas</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Sector</Label><Input {...register("sector")} placeholder="e.g., Agriculture, Women, SME" /></div>
                  <div className="space-y-2"><Label>Services Offered</Label><Input {...register("services")} placeholder="e.g., Loans, Savings, Insurance" /></div>
                  <div className="space-y-2"><Label>Target Audience</Label><Input {...register("targetAudience")} placeholder="e.g., Rural, Urban, Women" /></div>
                  <div className="space-y-2"><Label>Min Loan Amount (रू )</Label><Input type="number" {...register("minLoanAmount", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Max Loan Amount (रू )</Label><Input type="number" {...register("maxLoanAmount", { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Interest Rate</Label><Input {...register("interestRate")} placeholder="e.g., 12-18%" /></div>
                  <div className="space-y-2"><Label>Processing Fee</Label><Input {...register("processingFee")} placeholder="e.g., 1-2%" /></div>
                  <div className="flex items-center space-x-2"><Switch id="collateralRequired" onCheckedChange={(checked) => setValue("collateralRequired", checked)} /><Label>Collateral Required</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="governmentRegistered" onCheckedChange={(checked) => setValue("governmentRegistered", checked)} /><Label>Government Registered</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="rbiApproved" onCheckedChange={(checked) => setValue("rbiApproved", checked)} /><Label>RBI Approved</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="sebiRegistered" onCheckedChange={(checked) => setValue("sebiRegistered", checked)} /><Label>SEBI Registered</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="nbfcCertified" onCheckedChange={(checked) => setValue("nbfcCertified", checked)} /><Label>NBFC Certified</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="shgFinance" onCheckedChange={(checked) => setValue("shgFinance", checked)} /><Label>SHG Finance</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="womenEmpowerment" onCheckedChange={(checked) => setValue("womenEmpowerment", checked)} /><Label>Women Empowerment</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="farmerFinance" onCheckedChange={(checked) => setValue("farmerFinance", checked)} /><Label>Farmer Finance</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="startupFunding" onCheckedChange={(checked) => setValue("startupFunding", checked)} /><Label>Startup Funding</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Contact Person *</Label><Input {...register("contactPerson", { required: true })} /></div>
                  <div className="space-y-2"><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" {...register("contactEmail")} /></div>
                  <div className="space-y-2"><Label>Website</Label><Input {...register("website")} /></div>
                  <div className="space-y-2"><Label>City</Label><Input {...register("city")} /></div>
                  <div className="space-y-2"><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
                  <div className="flex items-center space-x-2"><Switch id="whatsappAvailable" onCheckedChange={(checked) => setValue("whatsappAvailable", checked)} /><Label>WhatsApp</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2"><Label>Full Address *</Label><Input {...register("fullAddress", { required: true })} /></div>
                  <div className="space-y-2"><Label>Working Hours</Label><Input {...register("workingHours")} /></div>
                  <div className="flex items-center space-x-2"><Switch id="available24_7" onCheckedChange={(checked) => setValue("available24_7", checked)} /><Label>24/7 Available</Label></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Images</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2 flex-1"><Label>Upload Images</Label><Input type="file" accept="image/*" multiple ref={fileInputRef} disabled={uploadingImages} onChange={(e) => processFiles(e.target.files)} /></div>
                    <div className="text-sm text-muted-foreground">{images.length}/10</div>
                  </div>
                  {imageError && <div className="text-red-600">{imageError}</div>}
                </div>
                {images.length > 0 && <div className="grid grid-cols-5 gap-3">{images.map((url, idx) => (<div key={idx} className="relative"><img src={url} alt="" className="h-20 w-full rounded-md border object-cover" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => removeImage(idx)}><X className="h-4 w-4" /></Button></div>))}</div>}
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue("isActive", checked)} /><Label>Active</Label></div>
                  <div className="flex items-center space-x-2"><Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} /><Label>Featured</Label></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {viewingService && <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService.title}</DialogTitle></DialogHeader><div className="grid grid-cols-2 gap-4"><div><p className="text-sm font-medium">Organization</p><p className="text-sm text-muted-foreground">{viewingService.organizationName}</p></div><div><p className="text-sm font-medium">Type</p><p className="text-sm text-muted-foreground">{viewingService.organizationType}</p></div><div><p className="text-sm font-medium">User ID</p><p className="text-sm text-muted-foreground">{viewingService.userId || "N/A"}</p></div><div><p className="text-sm font-medium">Role</p><p className="text-sm text-muted-foreground">{viewingService.role || "N/A"}</p></div></div></DialogContent></Dialog>}
    </div>
  );
}