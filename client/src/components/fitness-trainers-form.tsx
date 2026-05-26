import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Dumbbell, X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

type FitnessTrainersFormData = {
  title: string;
  description?: string;
  trainerName: string;
  gender?: string;
  userId?: string;
  role?: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  areaName?: string;
  specialization?: string;
  certifications?: string;
  experienceYears?: number;
  age?: number;
  qualifications?: string;
  trainingMode?: string;
  availableForHome?: boolean;
  availableAtGym?: boolean;
  availableOnline?: boolean;
  availableOutdoor?: boolean;
  personalTraining?: boolean;
  groupTraining?: boolean;
  strengthTraining?: boolean;
  cardioTraining?: boolean;
  yogaTraining?: boolean;
  pilatesTraining?: boolean;
  zumbaTraining?: boolean;
  crossfitTraining?: boolean;
  hiitTraining?: boolean;
  weightLoss?: boolean;
  weightGain?: boolean;
  muscleBuilding?: boolean;
  sportsSpecific?: boolean;
  rehabilitationTraining?: boolean;
  seniorFitness?: boolean;
  kidsFitness?: boolean;
  corporateFitness?: boolean;
  nutritionPlans?: boolean;
  dietConsultation?: boolean;
  mealPlans?: boolean;
  bodyAnalysis?: boolean;
  fitnessAssessment?: boolean;
  progressTracking?: boolean;
  videoConsultation?: boolean;
  freeTrial?: boolean;
  demoClass?: boolean;
  hourlyRate?: number;
  monthlyPackage?: number;
  yearlyPackage?: number;
  availabilityDays?: string;
  workingHours?: string;
  languagesKnown?: string;
  profileImage?: string;
  isActive?: boolean;
  isFeatured?: boolean;
};

export default function FitnessTrainersForm() {
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
  const { register, handleSubmit, reset, setValue } = useForm<FitnessTrainersFormData>();

  const getStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  };

  const userId = user?.id || getStoredUser()?.id;
  const role = user?.role || getStoredUser()?.role;

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["fitness-trainers", userId || null, role || null],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (userId) query.set('userId', userId);
      if (role) query.set('role', role);
      const url = `/api/admin/fitness-trainers${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FitnessTrainersFormData) => {
      const response = await fetch("/api/admin/fitness-trainers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fitness-trainers"] }); toast({ title: "Success", description: "Fitness Trainer created successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FitnessTrainersFormData }) => {
      const response = await fetch(`/api/admin/fitness-trainers/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message); }
      return response.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fitness-trainers"] }); toast({ title: "Success", description: "Updated successfully" }); handleCloseDialog(); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const response = await fetch(`/api/admin/fitness-trainers/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Failed"); return response.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fitness-trainers"] }); toast({ title: "Success", description: "Deleted successfully" }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
  });

  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingService(null); reset(); setImages([]); setImageError(null); setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleEdit = (service: any) => { setEditingService(service); setImages(service.photos || []); Object.keys(service).forEach((key) => { if (key !== "id" && key !== "createdAt" && key !== "updatedAt") setValue(key as any, service[key]); }); setIsDialogOpen(true); };
  const handleView = (service: any) => setViewingService(service);
  const handleDelete = (id: string) => { if (confirm("Delete?")) deleteMutation.mutate(id); };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => { const fd = new FormData(); files.forEach((f) => fd.append("files", f)); const res = await fetch("/api/upload-multiple", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); return Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : []; };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; setUploadingImages(true); setImageError(null); try { const urls = await uploadMultipleFiles(files); setImages((prev) => [...prev, ...urls]); } catch (err: any) { setImageError(err.message); } finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ""; } };
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
  const onSubmit = (data: FitnessTrainersFormData) => {
    const payload: any = { ...data, photos: images };
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();
    payload.userId = payload.userId || user?.id || stored?.id;
    payload.role = payload.role || user?.role || stored?.role;
    editingService ? updateMutation.mutate({ id: editingService.id, data: payload }) : createMutation.mutate(payload);
  };

  const checkboxes = ["availableForHome", "availableAtGym", "availableOnline", "availableOutdoor", "personalTraining", "groupTraining", "strengthTraining", "cardioTraining", "yogaTraining", "pilatesTraining", "zumbaTraining", "crossfitTraining", "hiitTraining", "weightLoss", "weightGain", "muscleBuilding", "sportsSpecific", "rehabilitationTraining", "seniorFitness", "kidsFitness", "corporateFitness", "nutritionPlans", "dietConsultation", "mealPlans", "bodyAnalysis", "fitnessAssessment", "progressTracking", "videoConsultation", "freeTrial", "demoClass"];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Fitness Trainers</h1><Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md">
            <CardHeader><div className="flex justify-between"><div><CardTitle className="text-lg">{service.title}</CardTitle><p className="text-sm text-muted-foreground">{service.trainerName}</p></div>{service.isFeatured && <Badge>Featured</Badge>}</div></CardHeader>
            <CardContent><div className="space-y-2 text-sm"><p><strong>Specialization:</strong> {service.specialization}</p><p><strong>City:</strong> {service.city}</p>{service.experienceYears && <p><strong>Experience:</strong> {service.experienceYears} years</p>}</div><div className="flex gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleView(service)}><Eye className="h-4 w-4" /></Button><Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button></div></CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService ? "Edit Fitness Trainer" : "Add Fitness Trainer"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title *</Label><Input {...register("title", { required: true })} /></div>
              <div><Label>Trainer Name *</Label><Input {...register("trainerName", { required: true })} /></div>
              <div><Label>Gender</Label><Input {...register("gender")} placeholder="Male/Female/Other" /></div>
              <div><Label>Age</Label><Input type="number" {...register("age", { valueAsNumber: true })} /></div>
              <div><Label>Phone *</Label><Input {...register("contactPhone", { required: true })} /></div>
              <div><Label>Email</Label><Input {...register("contactEmail")} /></div>
              <div><Label>Website</Label><Input {...register("website")} /></div>
              <div><Label>City *</Label><Input {...register("city", { required: true })} /></div>
              <div><Label>State</Label><Input {...register("state")} /></div>
              <div><Label>Full Address</Label><Input {...register("fullAddress")} /></div>
              <div><Label>Specialization</Label><Input {...register("specialization")} placeholder="e.g. Weight Loss, Muscle Building" /></div>
              <div><Label>Experience (Years)</Label><Input type="number" {...register("experienceYears", { valueAsNumber: true })} /></div>
              <div><Label>Qualifications</Label><Input {...register("qualifications")} /></div>
              <div><Label>Certifications</Label><Input {...register("certifications")} /></div>
              <div><Label>Training Mode</Label><Input {...register("trainingMode")} placeholder="Home/Gym/Online" /></div>
              <div><Label>Hourly Rate</Label><Input type="number" {...register("hourlyRate", { valueAsNumber: true })} /></div>
              <div><Label>Monthly Package</Label><Input type="number" {...register("monthlyPackage", { valueAsNumber: true })} /></div>
              <div><Label>Yearly Package</Label><Input type="number" {...register("yearlyPackage", { valueAsNumber: true })} /></div>
              <div><Label>Availability Days</Label><Input {...register("availabilityDays")} placeholder="Mon-Sun" /></div>
              <div><Label>Working Hours</Label><Input {...register("workingHours")} /></div>
              <div><Label>Languages Known</Label><Input {...register("languagesKnown")} /></div>
            </div>

            <div className="space-y-2">
              <Label>Training Services</Label>
              <div className="flex flex-wrap gap-2">
                {checkboxes.map((opt) => (
                  <label key={opt} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" {...register(opt as any)} className="rounded" />
                    {opt.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()).trim()}
                  </label>
                ))}
              </div>
            </div>

            <div><Label>Description</Label><Textarea {...register("description")} rows={3} /></div>
            <div><Label>Photos</Label><input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="w-full" /></div>
            {images.length > 0 && <div className="flex gap-2 flex-wrap">{images.map((img, idx) => <div key={idx} className="relative"><img src={img} alt="" className="w-20 h-20 object-cover rounded" /><button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button></div>)}</div>}
            {uploadingImages && <p>Uploading...</p>}
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editingService ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{viewingService?.title}</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">{Object.entries(viewingService || {}).filter(([k]) => !["id", "createdAt", "updatedAt"].includes(k)).map(([k, v]) => <p key={k}><strong>{k}:</strong> {String(v)}</p>)}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}