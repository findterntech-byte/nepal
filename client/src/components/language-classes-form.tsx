import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface LanguageClassesFormProps {
  onSuccess: () => void;
  editingClass?: any;
}

export default function LanguageClassesForm({ onSuccess, editingClass }: LanguageClassesFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      listingType: "language_class",
      proficiencyLevel: editingClass?.proficiencyLevel || "beginner",
      teachingMode: editingClass?.teachingMode || "offline",
      classType: editingClass?.classType || "group",
      country: editingClass?.country || "India",
      isActive: editingClass?.isActive !== undefined ? editingClass.isActive : true,
      isFeatured: editingClass?.isFeatured || false,
      certificationProvided: editingClass?.certificationProvided || false,
      freeDemoClass: editingClass?.freeDemoClass || false,
      nativeSpeaker: editingClass?.nativeSpeaker || false,
      ...editingClass,
    }
  });

  const [studyMaterials, setStudyMaterials] = useState<string[]>(editingClass?.studyMaterialsProvided || []);
  const [newMaterial, setNewMaterial] = useState("");
  const [images, setImages] = useState<string[]>(editingClass?.images || []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      const url = editingClass 
        ? `/api/admin/language-classes/${editingClass.id}`
        : '/api/admin/language-classes';

      const payload = {
        title: data.title,
        description: data.description || null,
        listingType: data.listingType || "language_class",
        languageName: data.languageName,
        proficiencyLevel: data.proficiencyLevel,
        courseDurationMonths: data.courseDurationMonths ? parseInt(data.courseDurationMonths.toString()) : null,
        classesPerWeek: data.classesPerWeek ? parseInt(data.classesPerWeek.toString()) : null,
        classDurationHours: data.classDurationHours ? parseFloat(data.classDurationHours.toString()) : null,
        teachingMode: data.teachingMode || null,
        classType: data.classType || null,
        batchSize: data.batchSize ? parseInt(data.batchSize.toString()) : null,
        instructorName: data.instructorName || null,
        instructorQualification: data.instructorQualification || null,
        instructorExperience: data.instructorExperience ? parseInt(data.instructorExperience.toString()) : null,
        nativeSpeaker: Boolean(data.nativeSpeaker === true || data.nativeSpeaker === "true"),
        feePerMonth: data.feePerMonth ? parseFloat(data.feePerMonth.toString()) : null,
        registrationFee: data.registrationFee ? parseFloat(data.registrationFee.toString()) : null,
        totalCourseFee: data.totalCourseFee ? parseFloat(data.totalCourseFee.toString()) : null,
        studyMaterialsProvided: Array.isArray(studyMaterials) && studyMaterials.length > 0 ? studyMaterials : [],
        certificationProvided: Boolean(data.certificationProvided === true || data.certificationProvided === "true"),
        freeDemoClass: Boolean(data.freeDemoClass === true || data.freeDemoClass === "true"),
        images,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail || null,
        country: data.country || "India",
        stateProvince: data.stateProvince || null,
        city: data.city || null,
        areaName: data.areaName || null,
        fullAddress: data.fullAddress || null,
        isActive: Boolean(data.isActive === true || data.isActive === "true"),
        isFeatured: Boolean(data.isFeatured === true || data.isFeatured === "true"),
        userId: user?.id,
        role: user?.role,
      };

      const response = await fetch(url, {
        method: editingClass ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.error('Error creating language class:', error);
        alert(`Error: ${error.message || 'Failed to save language class'}`);
      }
    } catch (error) {
      console.error('Error saving language class:', error);
      alert('Failed to save language class. Please try again.');
    }
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    const accepted: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!allowed.includes(f.type)) { setImageError('Only JPG, PNG, WEBP and GIF allowed'); continue; }
      if (f.size > maxSize) { setImageError('Each image must be <= 5MB'); continue; }
      accepted.push(f);
    }
    if (accepted.length === 0) return;

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

    uploadMultipleFiles(accepted)
      .then((urls) => {
        setImages((prev) => [...prev, ...urls].slice(0, 10));
        setImageError(null);
      })
      .catch((e) => {
        console.error(e);
        setImageError(e instanceof Error ? e.message : 'Failed to upload images');
      });
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); processFiles(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
  const openFileDialog = () => fileInputRef.current?.click();
  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="e.g., English Speaking Course" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div>
            <Label>Images</Label>
            <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`mt-2 border-2 rounded-md p-4 flex items-center justify-center ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'}`}>
              <div className="text-center">
                <p className="mb-2">Drag & drop images here, or <button type="button" onClick={openFileDialog} className="underline">select images</button></p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => { processFiles(e.target.files); e.currentTarget.value = ''; }} className="hidden" />
                {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img src={src} alt={`preview-${idx}`} className="w-24 h-24  rounded" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="languageName">Language *</Label>
              <Input id="languageName" {...register("languageName", { required: true })} placeholder="e.g., English, Spanish" />
            </div>

            <div>
              <Label htmlFor="proficiencyLevel">Proficiency Level *</Label>
              <Select onValueChange={(value) => setValue("proficiencyLevel", value)} defaultValue={editingClass?.proficiencyLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all_levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="classType">Class Type</Label>
              <Select onValueChange={(value) => setValue("classType", value)} defaultValue={editingClass?.classType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="one_on_one">One-on-One</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseDurationMonths">Duration (Months) *</Label>
              <Input id="courseDurationMonths" type="number" {...register("courseDurationMonths", { required: true, valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="classesPerWeek">Classes Per Week</Label>
              <Input id="classesPerWeek" type="number" {...register("classesPerWeek", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="classDurationHours">Class Duration (Hours)</Label>
              <Input id="classDurationHours" type="number" step="0.5" {...register("classDurationHours", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teachingMode">Teaching Mode</Label>
              <Select onValueChange={(value) => setValue("teachingMode", value)} defaultValue={editingClass?.teachingMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input id="batchSize" type="number" {...register("batchSize", { valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <Label>Study Materials Provided</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} placeholder="Add material" />
              <Button type="button" onClick={() => { if (newMaterial.trim()) { setStudyMaterials([...studyMaterials, newMaterial.trim()]); setNewMaterial(""); } }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {studyMaterials.map((material, idx) => (
                <Badge key={idx} variant="secondary">
                  {material}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setStudyMaterials(studyMaterials.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="feePerMonth">Fee Per Month (₹) *</Label>
              <Input id="feePerMonth" type="number" {...register("feePerMonth", { required: true, valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
              <Input id="registrationFee" type="number" {...register("registrationFee", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="totalCourseFee">Total Course Fee (₹)</Label>
              <Input id="totalCourseFee" type="number" {...register("totalCourseFee", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="certificationProvided" onCheckedChange={(checked) => setValue("certificationProvided", checked)} checked={watch("certificationProvided")} />
              <Label htmlFor="certificationProvided">Certification Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="freeDemoClass" onCheckedChange={(checked) => setValue("freeDemoClass", checked)} checked={watch("freeDemoClass")} />
              <Label htmlFor="freeDemoClass">Free Demo Class</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructorName">Instructor Name</Label>
              <Input id="instructorName" {...register("instructorName")} />
            </div>

            <div>
              <Label htmlFor="instructorQualification">Qualification</Label>
              <Input id="instructorQualification" {...register("instructorQualification")} />
            </div>

            <div>
              <Label htmlFor="instructorExperience">Experience (Years)</Label>
              <Input id="instructorExperience" type="number" {...register("instructorExperience", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="nativeSpeaker">Native Speaker</Label>
              <Select onValueChange={(value) => setValue("nativeSpeaker", value === "true")} defaultValue={editingClass?.nativeSpeaker?.toString()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" {...register("contactPerson", { required: true })} />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input id="contactPhone" {...register("contactPhone", { required: true })} />
            </div>
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>

            <div>
              <Label htmlFor="areaName">Area</Label>
              <Input id="areaName" {...register("areaName")} />
            </div>
          </div>

          <div>
            <Label htmlFor="fullAddress">Full Address</Label>
            <Textarea id="fullAddress" {...register("fullAddress")} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="isActive" onCheckedChange={(checked) => setValue("isActive", checked)} checked={watch("isActive")} />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} checked={watch("isFeatured")} />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">{editingClass ? 'Update' : 'Create'} Language Class</Button>
      </div>
    </form>
  );
}