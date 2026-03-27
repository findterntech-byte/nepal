import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, X, Eye, Edit, Trash2, MapPin } from "lucide-react";

interface SkillTrainingCertificationFormProps {
  onSuccess: () => void;
  editingTraining?: any;
  isDialog?: boolean;
}

export default function SkillTrainingCertificationForm({ onSuccess, editingTraining, isDialog = false }: SkillTrainingCertificationFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: editingTraining || {
      skillCategory: "technical",
      trainingType: "classroom",
      country: "India",
      isActive: true,
    }
  });

  const [skillsTeach, setSkillsTeach] = useState<string[]>(editingTraining?.skillsTaught || []);
  const [newSkill, setNewSkill] = useState("");
  const [careerOptions, setCareerOptions] = useState<string[]>(editingTraining?.careerOpportunities || []);
  const [newCareer, setNewCareer] = useState("");
  const [images, setImages] = useState<string[]>(editingTraining?.images || []);
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
      const url = editingTraining
        ? `/api/admin/skill-training-certification/${editingTraining.id}`
        : '/api/admin/skill-training-certification';

      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch(url, {
        method: editingTraining ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skillsTaught: skillsTeach,
          careerOpportunities: careerOptions,
          images,
          userId: user?.id || null,
          role: user?.role || 'user',
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving skill training:', error);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input id="title" {...register("title", { required: true })} placeholder="e.g., Full Stack Web Development" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="skillCategory">Skill Category *</Label>
              <Select onValueChange={(value) => setValue("skillCategory", value)} defaultValue={editingTraining?.skillCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical/IT</SelectItem>
                  <SelectItem value="business">Business & Management</SelectItem>
                  <SelectItem value="creative">Creative & Design</SelectItem>
                  <SelectItem value="vocational">Vocational Skills</SelectItem>
                  <SelectItem value="soft_skills">Soft Skills</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trainingType">Training Type *</Label>
              <Select onValueChange={(value) => setValue("trainingType", value)} defaultValue={editingTraining?.trainingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Skills Taught</Label>
            <div className="flex gap-2 mb-2">

              <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" />
              <Button type="button" onClick={() => { if (newSkill.trim()) { setSkillsTeach([...skillsTeach, newSkill.trim()]); setNewSkill(""); } }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsTeach.map((skill, idx) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSkillsTeach(skillsTeach.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
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
                  <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => setImages(images.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Institute Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instituteName">Institute Name *</Label>
              <Input id="instituteName" {...register("instituteName", { required: true })} />
            </div>

            <div>
              <Label htmlFor="certificationBody">Certification Body</Label>
              <Input id="certificationBody" {...register("certificationBody")} placeholder="e.g., NSDC, ISO" />
            </div>
          </div>

          <div>
            <Label htmlFor="certificationName">Certification Name</Label>
            <Input id="certificationName" {...register("certificationName")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="governmentRecognized" onCheckedChange={(checked) => setValue("governmentRecognized", checked)} checked={watch("governmentRecognized")} />
              <Label htmlFor="governmentRecognized">Government Recognized</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="internationallyRecognized" onCheckedChange={(checked) => setValue("internationallyRecognized", checked)} checked={watch("internationallyRecognized")} />
              <Label htmlFor="internationallyRecognized">Internationally Recognized</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseDurationDays">Duration (Days)</Label>
              <Input id="courseDurationDays" type="number" {...register("courseDurationDays", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="courseDurationMonths">Duration (Months)</Label>
              <Input id="courseDurationMonths" type="number" {...register("courseDurationMonths", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="totalClassHours">Total Class Hours</Label>
              <Input id="totalClassHours" type="number" {...register("totalClassHours", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="onlineMode" onCheckedChange={(checked) => setValue("onlineMode", checked)} checked={watch("onlineMode")} />
              <Label htmlFor="onlineMode">Online Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="offlineMode" onCheckedChange={(checked) => setValue("offlineMode", checked)} checked={watch("offlineMode")} />
              <Label htmlFor="offlineMode">Offline Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="weekendBatches" onCheckedChange={(checked) => setValue("weekendBatches", checked)} checked={watch("weekendBatches")} />
              <Label htmlFor="weekendBatches">Weekend Batches</Label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="practicalTraining" onCheckedChange={(checked) => setValue("practicalTraining", checked)} checked={watch("practicalTraining")} />
              <Label htmlFor="practicalTraining">Practical Training</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="studyMaterialProvided" onCheckedChange={(checked) => setValue("studyMaterialProvided", checked)} checked={watch("studyMaterialProvided")} />
              <Label htmlFor="studyMaterialProvided">Study Material</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="internshipIncluded" onCheckedChange={(checked) => setValue("internshipIncluded", checked)} checked={watch("internshipIncluded")} />
              <Label htmlFor="internshipIncluded">Internship Included</Label>
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
              <Label htmlFor="totalFee">Total Fee (₹) *</Label>
              <Input id="totalFee" type="number" {...register("totalFee", { required: true, valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
              <Input id="registrationFee" type="number" {...register("registrationFee", { valueAsNumber: true })} />
            </div>

            <div>
              <Label htmlFor="examFee">Exam Fee (₹)</Label>
              <Input id="examFee" type="number" {...register("examFee", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="installmentAvailable" onCheckedChange={(checked) => setValue("installmentAvailable", checked)} checked={watch("installmentAvailable")} />
              <Label htmlFor="installmentAvailable">Installment Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="scholarshipAvailable" onCheckedChange={(checked) => setValue("scholarshipAvailable", checked)} checked={watch("scholarshipAvailable")} />
              <Label htmlFor="scholarshipAvailable">Scholarship Available</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placement & Career</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="placementAssistance" onCheckedChange={(checked) => setValue("placementAssistance", checked)} checked={watch("placementAssistance")} />
              <Label htmlFor="placementAssistance">Placement Assistance</Label>
            </div>

            <div>
              <Label htmlFor="placementRate">Placement Rate (%)</Label>
              <Input id="placementRate" type="number" {...register("placementRate", { valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <Label>Career Opportunities</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newCareer} onChange={(e) => setNewCareer(e.target.value)} placeholder="Add career option" />
              <Button type="button" onClick={() => { if (newCareer.trim()) { setCareerOptions([...careerOptions, newCareer.trim()]); setNewCareer(""); } }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {careerOptions.map((career, idx) => (
                <Badge key={idx} variant="secondary">
                  {career}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCareerOptions(careerOptions.filter((_, i) => i !== idx))} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="averageSalaryPackage">Average Salary Package (₹)</Label>
            <Input id="averageSalaryPackage" type="number" {...register("averageSalaryPackage", { valueAsNumber: true })} />
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
            <Label htmlFor="stateProvince">State/Province</Label>
            <Input id="stateProvince" {...register("stateProvince")} />
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
        <Button type="submit">{editingTraining ? 'Update' : 'Create'} Training Program</Button>
      </div>
    </form>
  );

  if (isDialog) {
    return formContent;
  }

  return formContent;
}