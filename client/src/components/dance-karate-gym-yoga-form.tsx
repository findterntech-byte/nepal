import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface DanceKarateGymYogaFormProps {
  onSuccess: () => void;
  editingClass?: any;
}

export default function DanceKarateGymYogaForm({ onSuccess, editingClass }: DanceKarateGymYogaFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: editingClass || {
      classCategory: "dance",
      country: "India",
      isActive: true,
    }
  });

  const [images, setImages] = useState<string[]>(editingClass?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);

  const uploadMultipleImages = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const res = await fetch('/api/admin/upload-multiple', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    const urls = Array.isArray(data?.files) ? data.files.map((f: any) => f?.url).filter(Boolean) : [];
    return urls as string[];
  };

  const onSubmit = async (data: any) => {
    try {
      // Convert empty strings to null for numeric fields
      const sanitizedData = {
        ...data,
        userId: user?.id,
        role: user?.role,
        images,
        instructorExperienceYears: data.instructorExperienceYears && data.instructorExperienceYears !== '' ? parseInt(data.instructorExperienceYears) : null,
        feePerMonth: parseFloat(data.feePerMonth), // Required field, should always have a value
        feePerSession: data.feePerSession && data.feePerSession !== '' ? parseFloat(data.feePerSession) : null,
        registrationFee: data.registrationFee && data.registrationFee !== '' ? parseFloat(data.registrationFee) : null,
        sessionDurationMinutes: data.sessionDurationMinutes && data.sessionDurationMinutes !== '' ? parseInt(data.sessionDurationMinutes) : null,
        sessionsPerWeek: data.sessionsPerWeek && data.sessionsPerWeek !== '' ? parseInt(data.sessionsPerWeek) : null,
        batchSize: data.batchSize && data.batchSize !== '' ? parseInt(data.batchSize) : null,
      };

      const url = editingClass 
        ? `/api/admin/dance-karate-gym-yoga/${editingClass.id}`
        : '/api/admin/dance-karate-gym-yoga';

      const response = await fetch(url, {
        method: editingClass ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input {...register("title", { required: true })} placeholder="e.g., Zumba Dance Classes" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Class Category *</Label>
              <Select onValueChange={(value) => setValue("classCategory", value)} defaultValue={watch("classCategory")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dance">Dance</SelectItem>
                  <SelectItem value="karate">Karate</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="martial_arts">Martial Arts</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Class Type *</Label>
              <Input {...register("classType", { required: true })} placeholder="e.g., Zumba, Hatha Yoga" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Instructor Name *</Label>
              <Input {...register("instructorName", { required: true })} />
            </div>

            <div>
              <Label>Experience (Years)</Label>
              <Input type="number" {...register("instructorExperienceYears")} />
            </div>
          </div>

          <div>
            <Label>Qualification</Label>
            <Input {...register("instructorQualification")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fee & Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Fee Per Month (₹) *</Label>
              <Input type="number" step="0.01" {...register("feePerMonth", { required: true })} />
            </div>

            <div>
              <Label>Fee Per Session (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerSession")} />
            </div>

            <div>
              <Label>Registration Fee (₹)</Label>
              <Input type="number" step="0.01" {...register("registrationFee")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Session Duration (Minutes)</Label>
              <Input type="number" {...register("sessionDurationMinutes")} />
            </div>

            <div>
              <Label>Sessions Per Week</Label>
              <Input type="number" {...register("sessionsPerWeek")} />
            </div>

            <div>
              <Label>Batch Size</Label>
              <Input type="number" {...register("batchSize")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Upload Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={uploadingImages}
              onChange={async (e) => {
                const fl = e.target.files;
                if (!fl || fl.length === 0) return;
                try {
                  setUploadingImages(true);
                  const urls = await uploadMultipleImages(fl);
                  setImages((prev) => [...prev, ...(urls || [])]);
                  e.target.value = '';
                } catch (err: any) {
                  console.error('Image upload error:', err);
                  alert(err?.message || 'Failed to upload images');
                } finally {
                  setUploadingImages(false);
                }
              }}
            />
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((url, idx) => (
                <Badge key={`${url}-${idx}`} variant="secondary" className="max-w-full">
                  <span className="truncate max-w-[240px] inline-block">{url}</span>
                  <X
                    className="w-3 h-3 ml-2 cursor-pointer"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch {...register("trialClassAvailable")} />
              <Label>Trial Class Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("certificationProvided")} />
              <Label>Certification Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("equipmentProvided")} />
              <Label>Equipment Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch {...register("weekendBatches")} />
              <Label>Weekend Batches</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Person *</Label>
              <Input {...register("contactPerson", { required: true })} />
            </div>

            <div>
              <Label>Contact Phone *</Label>
              <Input {...register("contactPhone", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input {...register("city")} />
            </div>

            <div>
              <Label>Area</Label>
              <Input {...register("areaName")} />
            </div>
          </div>

          <div>
            <Label>Full Address *</Label>
            <Textarea {...register("fullAddress", { required: true })} rows={2} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">{editingClass ? 'Update' : 'Create'} Class</Button>
      </div>
    </form>
  );
}