
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
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface TuitionPrivateClassesFormProps {
  onSuccess: () => void;
  editingClass?: any;
}

export default function TuitionPrivateClassesForm({ onSuccess, editingClass }: TuitionPrivateClassesFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: editingClass || {
      listingType: "tuition",
      subjectCategory: "academic",
      teachingMode: "offline",
      classType: "group",
      country: "India",
      isActive: true,
      isFeatured: false,
      demoClassAvailable: false,
      studyMaterialProvided: false,
      testSeriesIncluded: false,
      doubtClearingSessions: false,
      flexibleTimings: false,
      weekendClasses: false,
      homeTuitionAvailable: false,
      onlineClassesAvailable: false,
    }
  });

  const [subjects, setSubjects] = useState<string[]>(editingClass?.subjectsOffered || []);
  const [newSubject, setNewSubject] = useState("");
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
      const feePerHourRaw = data?.feePerHour;
      const feePerMonthRaw = data?.feePerMonth;
      const feePerSubjectRaw = data?.feePerSubject;
      const hasAnyFee =
        (typeof feePerHourRaw === 'number' && !isNaN(feePerHourRaw)) ||
        (typeof feePerMonthRaw === 'number' && !isNaN(feePerMonthRaw)) ||
        (typeof feePerSubjectRaw === 'number' && !isNaN(feePerSubjectRaw)) ||
        (typeof feePerHourRaw === 'string' && feePerHourRaw.trim() !== '') ||
        (typeof feePerMonthRaw === 'string' && feePerMonthRaw.trim() !== '') ||
        (typeof feePerSubjectRaw === 'string' && feePerSubjectRaw.trim() !== '');

      if (!hasAnyFee) {
        toast({
          title: "Error",
          description: "Please fill at least one fee in Fee Structure (per hour/month/subject).",
          variant: "destructive",
        });
        return;
      }

      // Clean up the data
      const cleanedData = {
        ...data,
        subjectsOffered: subjects,
        images,
        // Convert numeric fields
        batchSize: data.batchSize ? parseInt(data.batchSize) : null,
        minGrade: data.minGrade ? parseInt(data.minGrade) : null,
        maxGrade: data.maxGrade ? parseInt(data.maxGrade) : null,
        tutorExperienceYears: data.tutorExperienceYears ? parseInt(data.tutorExperienceYears) : null,
        // Convert decimal fields
        feePerHour: data.feePerHour ? parseFloat(data.feePerHour) : null,
        feePerMonth: data.feePerMonth ? parseFloat(data.feePerMonth) : null,
        feePerSubject: data.feePerSubject ? parseFloat(data.feePerSubject) : null,
        // Ensure boolean fields are actual booleans
        demoClassAvailable: !!data.demoClassAvailable,
        studyMaterialProvided: !!data.studyMaterialProvided,
        testSeriesIncluded: !!data.testSeriesIncluded,
        doubtClearingSessions: !!data.doubtClearingSessions,
        flexibleTimings: !!data.flexibleTimings,
        weekendClasses: !!data.weekendClasses,
        homeTuitionAvailable: !!data.homeTuitionAvailable,
        onlineClassesAvailable: !!data.onlineClassesAvailable,
        isActive: !!data.isActive,
        isFeatured: !!data.isFeatured,
      };

      // Attach user identity so server can persist owner information
      if (user) {
        cleanedData.userId = editingClass?.userId || user.id;
        cleanedData.role = editingClass?.role || user.role || null;
      }

      const url = editingClass 
        ? `/api/admin/tuition-private-classes/${editingClass.id}`
        : '/api/admin/tuition-private-classes';
      
      const response = await fetch(url, {
        method: editingClass ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Tuition class ${editingClass ? 'updated' : 'created'} successfully`,
        });
        onSuccess();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to save tuition class",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving tuition class:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
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
            <Input {...register("title", { required: true })} placeholder="e.g., Mathematics Tuition for Class 10" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subject Category *</Label>
              <Select onValueChange={(value) => setValue("subjectCategory", value)} defaultValue={watch("subjectCategory")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="competitive_exam">Competitive Exam</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="computer">Computer</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Teaching Mode *</Label>
              <Select onValueChange={(value) => setValue("teachingMode", value)} defaultValue={watch("teachingMode")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Subjects Offered</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add subject"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject();
                  }
                }}
              />
              <Button type="button" onClick={addSubject}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, idx) => (
                <Badge key={idx} variant="secondary">
                  {subject}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSubjects(subjects.filter((_, i) => i !== idx))}
                  />
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
                  toast({
                    title: 'Error',
                    description: err?.message || 'Failed to upload images',
                    variant: 'destructive',
                  });
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
          <CardTitle>Tutor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tutor Name *</Label>
              <Input {...register("tutorName", { required: true })} />
            </div>

            <div>
              <Label>Qualification</Label>
              <Input {...register("tutorQualification")} placeholder="e.g., M.Sc. Mathematics" />
            </div>
          </div>

          <div>
            <Label>Experience (Years)</Label>
            <Input type="number" {...register("tutorExperienceYears")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Class Type *</Label>
              <Select onValueChange={(value) => setValue("classType", value)} defaultValue={watch("classType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Batch Size</Label>
              <Input type="number" {...register("batchSize")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Grade Level</Label>
              <Input {...register("gradeLevel")} placeholder="e.g., Class 10-12" />
            </div>

            <div>
              <Label>Min Grade</Label>
              <Input type="number" {...register("minGrade")} />
            </div>

            <div>
              <Label>Max Grade</Label>
              <Input type="number" {...register("maxGrade")} />
            </div>
          </div>

          <div>
            <Label>Board</Label>
            <Input {...register("board")} placeholder="e.g., CBSE, ICSE, State Board" />
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
              <Label>Fee Per Hour (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerHour")} />
            </div>

            <div>
              <Label>Fee Per Month (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerMonth")} />
            </div>

            <div>
              <Label>Fee Per Subject (₹)</Label>
              <Input type="number" step="0.01" {...register("feePerSubject")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features & Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("demoClassAvailable")}
                onCheckedChange={(checked) => setValue("demoClassAvailable", checked)}
              />
              <Label>Demo Class Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("studyMaterialProvided")}
                onCheckedChange={(checked) => setValue("studyMaterialProvided", checked)}
              />
              <Label>Study Material Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("testSeriesIncluded")}
                onCheckedChange={(checked) => setValue("testSeriesIncluded", checked)}
              />
              <Label>Test Series Included</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("doubtClearingSessions")}
                onCheckedChange={(checked) => setValue("doubtClearingSessions", checked)}
              />
              <Label>Doubt Clearing Sessions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("flexibleTimings")}
                onCheckedChange={(checked) => setValue("flexibleTimings", checked)}
              />
              <Label>Flexible Timings</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("weekendClasses")}
                onCheckedChange={(checked) => setValue("weekendClasses", checked)}
              />
              <Label>Weekend Classes</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("homeTuitionAvailable")}
                onCheckedChange={(checked) => setValue("homeTuitionAvailable", checked)}
              />
              <Label>Home Tuition Available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={watch("onlineClassesAvailable")}
                onCheckedChange={(checked) => setValue("onlineClassesAvailable", checked)}
              />
              <Label>Online Classes Available</Label>
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
              <Label>Contact Person *</Label>
              <Input {...register("contactPerson", { required: true })} />
            </div>

            <div>
              <Label>Contact Phone *</Label>
              <Input {...register("contactPhone", { required: true })} />
            </div>
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input type="email" {...register("contactEmail")} />
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
              <Label>City</Label>
              <Input {...register("city")} />
            </div>

            <div>
              <Label>Area</Label>
              <Input {...register("areaName")} />
            </div>
          </div>

          <div>
            <Label>State/Province</Label>
            <Input {...register("stateProvince")} />
          </div>

          <div>
            <Label>Full Address</Label>
            <Textarea {...register("fullAddress")} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label>Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={watch("isFeatured")}
              onCheckedChange={(checked) => setValue("isFeatured", checked)}
            />
            <Label>Featured</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit">{editingClass ? 'Update' : 'Create'} Tuition Class</Button>
      </div>
    </form>
  );
}
