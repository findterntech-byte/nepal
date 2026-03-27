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

interface AcademiesMusicArtsSportsFormProps {
  onSuccess: () => void;
  editingAcademy?: any;
}

export default function AcademiesMusicArtsSportsForm({ onSuccess, editingAcademy }: AcademiesMusicArtsSportsFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: editingAcademy || {
      academyCategory: "music",
      classType: "group",
      country: "India",
      isActive: true,
    }
  });

  const [coursesOffered, setCoursesOffered] = useState<string[]>(editingAcademy?.coursesOffered || []);
  const [newCourse, setNewCourse] = useState("");
  const [facilities, setFacilities] = useState<string[]>(editingAcademy?.facilities || []);
  const [newFacility, setNewFacility] = useState("");
  const [images, setImages] = useState<string[]>(editingAcademy?.images || []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Ensure userId is available
      if (!user?.id) {
        alert('You must be logged in to create an academy');
        return;
      }

      const url = editingAcademy
        ? `/api/admin/academies-music-arts-sports/${editingAcademy.id}`
        : '/api/admin/academies-music-arts-sports';

      const response = await fetch(url, {
        method: editingAcademy ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          coursesOffered,
          facilities,
          images,
          userId: user.id,
          role: user.role || 'user',
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(errorData.message || 'Failed to save academy');
      }
    } catch (error) {
      console.error('Error saving academy:', error);
      alert('Failed to save academy');
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
            <Label htmlFor="title">Academy Title *</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="e.g., Star Music Academy" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={4} />
          </div>

          <div>
            <Label>Images</Label>
            <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`mt-2 border-2 rounded-md p-4 flex items-center justify-center ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'}`}>
              <div className="text-center">
                <p className="mb-2">Drag & drop images here, or <button type="button" onClick={openFileDialog} className="underline">select images</button></p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => processFiles(e.target.files)} className="hidden" />
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
              <Label htmlFor="academyCategory">Academy Category *</Label>
              <Select onValueChange={(value) => setValue("academyCategory", value)} defaultValue={editingAcademy?.academyCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="dance">Dance</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="performing_arts">Performing Arts</SelectItem>
                  <SelectItem value="martial_arts">Martial Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" {...register("specialization")} placeholder="e.g., Classical Guitar, Bharatanatyam" />
            </div>

            <div>
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input id="establishedYear" type="number" {...register("establishedYear", { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses & Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Courses Offered</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newCourse} onChange={(e) => setNewCourse(e.target.value)} placeholder="Add course" />
              <Button type="button" onClick={() => { if (newCourse.trim()) { setCoursesOffered([...coursesOffered, newCourse.trim()]); setNewCourse(""); } }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {coursesOffered.map((course, idx) => (
                <Badge key={idx} variant="secondary">
                  {course}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCoursesOffered(coursesOffered.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="classType">Class Type</Label>
              <Select onValueChange={(value) => setValue("classType", value)} defaultValue={editingAcademy?.classType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ageGroup">Age Group</Label>
              <Input id="ageGroup" {...register("ageGroup")} placeholder="e.g., 5-18 years" />
            </div>

            <div>
              <Label htmlFor="courseDurationMonths">Course Duration (Months)</Label>
              <Input id="courseDurationMonths" type="number" {...register("courseDurationMonths", { valueAsNumber: true })} />
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
              <Label htmlFor="admissionFee">Admission Fee (₹)</Label>
              <Input id="admissionFee" type="number" {...register("admissionFee", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="instrumentRentalFee">Instrument/Equipment Rental (₹)</Label>
              <Input id="instrumentRentalFee" type="number" {...register("instrumentRentalFee", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="certificationOffered" onCheckedChange={(checked) => setValue("certificationOffered", checked)} checked={watch("certificationOffered")} />
              <Label htmlFor="certificationOffered">Certification Offered</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="freeTrialClass" onCheckedChange={(checked) => setValue("freeTrialClass", checked)} checked={watch("freeTrialClass")} />
              <Label htmlFor="freeTrialClass">Free Trial Class</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facilities & Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facilities Available</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newFacility} onChange={(e) => setNewFacility(e.target.value)} placeholder="Add facility" />
              <Button type="button" onClick={() => { if (newFacility.trim()) { setFacilities([...facilities, newFacility.trim()]); setNewFacility(""); } }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility, idx) => (
                <Badge key={idx} variant="secondary">
                  {facility}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFacilities(facilities.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="airConditioned" onCheckedChange={(checked) => setValue("airConditioned", checked)} checked={watch("airConditioned")} />
              <Label htmlFor="airConditioned">Air Conditioned</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="parkingAvailable" onCheckedChange={(checked) => setValue("parkingAvailable", checked)} checked={watch("parkingAvailable")} />
              <Label htmlFor="parkingAvailable">Parking Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="changingRooms" onCheckedChange={(checked) => setValue("changingRooms", checked)} checked={watch("changingRooms")} />
              <Label htmlFor="changingRooms">Changing Rooms</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="equipmentProvided" onCheckedChange={(checked) => setValue("equipmentProvided", checked)} checked={watch("equipmentProvided")} />
              <Label htmlFor="equipmentProvided">Equipment Provided</Label>
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
              <Label htmlFor="headInstructor">Head Instructor</Label>
              <Input id="headInstructor" {...register("headInstructor")} />
            </div>

            <div>
              <Label htmlFor="totalInstructors">Total Instructors</Label>
              <Input id="totalInstructors" type="number" {...register("totalInstructors", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="instructorQualification">Qualification</Label>
              <Input id="instructorQualification" {...register("instructorQualification")} />
            </div>

            <div>
              <Label htmlFor="awardsAchievements">Awards & Achievements</Label>
              <Input id="awardsAchievements" {...register("awardsAchievements")} />
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

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register("website")} placeholder="https://" />
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
            <Label htmlFor="stateProvince">State/Province</Label>
            <Input id="stateProvince" {...register("stateProvince")} />
          </div>

          <div>
            <Label htmlFor="fullAddress">Full Address *</Label>
            <Textarea id="fullAddress" {...register("fullAddress", { required: true })} rows={3} />
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
        <Button type="submit">{editingAcademy ? 'Update' : 'Create'} Academy</Button>
      </div>
    </form>
  );
}