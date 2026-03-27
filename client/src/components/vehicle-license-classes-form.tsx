import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Edit, Trash2, Eye, GraduationCap } from "lucide-react";

interface VehicleLicenseClassFormData {
  id?: string;
  title: string;
  description?: string;
  licenseClass: string;
  vehicleType: string;
  licenseType: string;
  trainingProviderName: string;
  isRtoApproved?: boolean;
  rtoApprovalNumber?: string;
  instructorName?: string;
  instructorExperienceYears?: number;
  instructorLicenseNumber?: string;
  courseDurationDays: number;
  courseDurationHours?: number;
  trainingMode?: string;
  courseIncludes?: string[];
  syllabusCovered?: string[];
  courseFee: number;
  registrationFee?: number;
  testFee?: number;
  totalFee?: number;
  installmentAvailable?: boolean;
  discountAvailable?: boolean;
  discountPercentage?: number;
  minimumAge?: number;
  educationalQualification?: string;
  medicalCertificateRequired?: boolean;
  documentsRequired?: string[];
  practicalTrainingHours?: number;
  theoryClassesHours?: number;
  simulationTraining?: boolean;
  drivingTrackAvailable?: boolean;
  pickupDropFacility?: boolean;
  studyMaterialProvided?: boolean;
  onlineTestPractice?: boolean;
  rtoTestAssistance?: boolean;
  trainingVehicles?: string[];
  vehicleCondition?: string;
  dualControlVehicles?: boolean;
  batchSize?: number;
  currentBatchSeats?: number;
  nextBatchStartDate?: string;
  classTimings?: string;
  weekendBatches?: boolean;
  successRatePercentage?: number;
  totalStudentsTrained?: number;
  certificationProvided?: boolean;
  governmentCertified?: boolean;
  country: string;
  stateProvince?: string;
  city?: string;
  areaName?: string;
  fullAddress: string;
  trainingCenterAddress?: string;
  multipleLocations?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
  images?: string[];
  documents?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  jobPlacementAssistance?: boolean;
  refresherCourseAvailable?: boolean;
  internationalLicenseTraining?: boolean;
  femaleInstructorAvailable?: boolean;
  languageOptions?: string[];
  termsAndConditions?: string;
  cancellationPolicy?: string;
  refundPolicy?: string;
  rating?: number;
  reviewCount?: number;
  totalEnrollments?: number;
  availabilityStatus?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  userId?: string;
  role?: string;
  ownerId?: string;
}

export default function VehicleLicenseClassesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [courseIncludes, setCourseIncludes] = useState<string[]>([]);
  const [syllabusCovered, setSyllabusCovered] = useState<string[]>([]);
  const [documentsRequired, setDocumentsRequired] = useState<string[]>([]);
  const [trainingVehicles, setTrainingVehicles] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newCourseItem, setNewCourseItem] = useState("");
  const [newSyllabus, setNewSyllabus] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<VehicleLicenseClassFormData | null>(null);
  const [viewingClass, setViewingClass] = useState<VehicleLicenseClassFormData | null>(null);

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
      }
    }
    return null;
  };

  const localUser = getUserFromLocalStorage();
  const userId = localUser?.id || user?.id;
  const userRole = localUser?.role || user?.role;

  const { register, handleSubmit, setValue, watch, reset } = useForm<VehicleLicenseClassFormData>({
    defaultValues: {
      country: "India",
      minimumAge: 18,
      medicalCertificateRequired: true,
      rtoTestAssistance: true,
      dualControlVehicles: true,
      certificationProvided: true,
      governmentCertified: false,
      isRtoApproved: false,
      installmentAvailable: false,
      discountAvailable: false,
      simulationTraining: false,
      drivingTrackAvailable: false,
      pickupDropFacility: false,
      studyMaterialProvided: false,
      onlineTestPractice: false,
      weekendBatches: false,
      multipleLocations: false,
      jobPlacementAssistance: false,
      refresherCourseAvailable: false,
      internationalLicenseTraining: false,
      femaleInstructorAvailable: false,
      availabilityStatus: "available",
      isActive: true,
      isFeatured: false,
      isVerified: false,
      userId: userId,
      role: userRole,
    },
  });

  useEffect(() => {
    const fetchClasses = async () => {
      if (!userId) return;

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId);
        queryParams.append('role', userRole || 'user');

        const response = await fetch(`/api/admin/vehicle-license-classes?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          queryClient.setQueryData(["/api/admin/vehicle-license-classes", userId, userRole], data);
        }
      } catch (error) {
        console.error('Error fetching classes in useEffect:', error);
      }
    };

    fetchClasses();
  }, [userId, userRole, queryClient]);

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["/api/admin/vehicle-license-classes", userId, userRole],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      if (userRole) params.append('role', userRole);

      const response = await fetch(`/api/admin/vehicle-license-classes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch classes");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VehicleLicenseClassFormData) => {
      const url = editingClass
        ? `/api/admin/vehicle-license-classes/${editingClass.id}`
        : "/api/admin/vehicle-license-classes";
      const method = editingClass ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: userId,
          role: userRole,
          ownerId: userId,
          courseIncludes,
          syllabusCovered,
          documentsRequired,
          trainingVehicles,
          languageOptions,
          images,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingClass ? "update" : "create"} license class`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vehicle-license-classes"] });
      toast({
        title: "Success",
        description: `License class ${editingClass ? "updated" : "created"} successfully`,
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/vehicle-license-classes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete license class");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vehicle-license-classes"] });
      toast({ title: "Success", description: "License class deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('files', f));
      const res = await fetch('/api/admin/upload-multiple', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const uploadedUrls = Array.isArray(data?.files)
        ? data.files.map((f: any) => f?.url).filter(Boolean)
        : [];

      const nextImages = [...images, ...uploadedUrls];
      setImages(nextImages);
      setValue("images", nextImages);

      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingClass(null);
    reset();
    setCourseIncludes([]);
    setSyllabusCovered([]);
    setDocumentsRequired([]);
    setTrainingVehicles([]);
    setLanguageOptions([]);
    setImages([]);
  };

  const handleEdit = (licenseClass: any) => {
    setEditingClass(licenseClass);
    Object.entries(licenseClass).forEach(([key, value]) => {
      setValue(key as keyof VehicleLicenseClassFormData, value as any);
    });
    setCourseIncludes(licenseClass.courseIncludes || []);
    setSyllabusCovered(licenseClass.syllabusCovered || []);
    setDocumentsRequired(licenseClass.documentsRequired || []);
    setTrainingVehicles(licenseClass.trainingVehicles || []);
    setLanguageOptions(licenseClass.languageOptions || []);
    setImages(licenseClass.images || []);
    setShowDialog(true);
  };

  const handleView = (licenseClass: any) => {
    setViewingClass(licenseClass);
    setShowViewDialog(true);
  };

  const onSubmit = (data: VehicleLicenseClassFormData) => {
    // Convert empty string dates to null
    const sanitizedData = {
      ...data,
      nextBatchStartDate: data.nextBatchStartDate || undefined,
    };

    // Ensure userId and role are properly set from localStorage or user context
    const formDataWithUser = {
      ...sanitizedData,
      userId: userId,
      role: userRole,
      ownerId: userId,
    };

    createMutation.mutate(formDataWithUser);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vehicle License Classes</h2>
          <p className="text-muted-foreground">Manage driving license training programs</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add License Class
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Edit License Class" : "Add New License Class"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input id="title" {...register("title", { required: true })} placeholder="e.g., Two Wheeler License Training" />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} rows={3} placeholder="Describe the training program..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="licenseClass">License Class *</Label>
                    <Select onValueChange={(value) => setValue("licenseClass", value)} defaultValue={editingClass?.licenseClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                        <SelectItem value="light_motor_vehicle">Light Motor Vehicle</SelectItem>
                        <SelectItem value="heavy_motor_vehicle">Heavy Motor Vehicle</SelectItem>
                        <SelectItem value="transport_vehicle">Transport Vehicle</SelectItem>
                        <SelectItem value="commercial_vehicle">Commercial Vehicle</SelectItem>
                        <SelectItem value="hazardous_goods">Hazardous Goods</SelectItem>
                        <SelectItem value="passenger_vehicle">Passenger Vehicle</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select onValueChange={(value) => setValue("vehicleType", value)} defaultValue={editingClass?.vehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="trailer">Trailer</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="licenseType">License Type *</Label>
                    <Select onValueChange={(value) => setValue("licenseType", value)} defaultValue={editingClass?.licenseType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learner">Learner</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Training Provider Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trainingProviderName">Training Provider Name *</Label>
                    <Input id="trainingProviderName" {...register("trainingProviderName", { required: true })} />
                  </div>

                  <div>
                    <Label htmlFor="rtoApprovalNumber">RTO Approval Number</Label>
                    <Input id="rtoApprovalNumber" {...register("rtoApprovalNumber")} />
                  </div>

                  <div>
                    <Label htmlFor="instructorName">Instructor Name</Label>
                    <Input id="instructorName" {...register("instructorName")} />
                  </div>

                  <div>
                    <Label htmlFor="instructorExperienceYears">Instructor Experience (Years)</Label>
                    <Input id="instructorExperienceYears" type="number" {...register("instructorExperienceYears", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="instructorLicenseNumber">Instructor License Number</Label>
                    <Input id="instructorLicenseNumber" {...register("instructorLicenseNumber")} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="isRtoApproved" onCheckedChange={(checked) => setValue("isRtoApproved", checked)} checked={watch("isRtoApproved")} />
                  <Label htmlFor="isRtoApproved">RTO Approved</Label>
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="courseDurationDays">Course Duration (Days) *</Label>
                    <Input id="courseDurationDays" type="number" {...register("courseDurationDays", { required: true, valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="courseDurationHours">Course Duration (Hours)</Label>
                    <Input id="courseDurationHours" type="number" {...register("courseDurationHours", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="trainingMode">Training Mode</Label>
                    <Select onValueChange={(value) => setValue("trainingMode", value)} defaultValue={editingClass?.trainingMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="practicalTrainingHours">Practical Training Hours</Label>
                    <Input id="practicalTrainingHours" type="number" {...register("practicalTrainingHours", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="theoryClassesHours">Theory Classes Hours</Label>
                    <Input id="theoryClassesHours" type="number" {...register("theoryClassesHours", { valueAsNumber: true })} />
                  </div>
                </div>

                <div>
                  <Label>Course Includes</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newCourseItem} onChange={(e) => setNewCourseItem(e.target.value)} placeholder="Add course item" />
                    <Button type="button" onClick={() => { if (newCourseItem.trim()) { setCourseIncludes([...courseIncludes, newCourseItem.trim()]); setNewCourseItem(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseIncludes.map((item, idx) => (
                      <Badge key={idx} variant="secondary">
                        {item}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCourseIncludes(courseIncludes.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Syllabus Covered</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newSyllabus} onChange={(e) => setNewSyllabus(e.target.value)} placeholder="Add syllabus topic" />
                    <Button type="button" onClick={() => { if (newSyllabus.trim()) { setSyllabusCovered([...syllabusCovered, newSyllabus.trim()]); setNewSyllabus(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {syllabusCovered.map((item, idx) => (
                      <Badge key={idx} variant="secondary">
                        {item}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSyllabusCovered(syllabusCovered.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="courseFee">Course Fee (₹) *</Label>
                    <Input id="courseFee" type="number" {...register("courseFee", { required: true, valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                    <Input id="registrationFee" type="number" {...register("registrationFee", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="testFee">Test Fee (₹)</Label>
                    <Input id="testFee" type="number" {...register("testFee", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="totalFee">Total Fee (₹)</Label>
                    <Input id="totalFee" type="number" {...register("totalFee", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="discountPercentage">Discount (%)</Label>
                    <Input id="discountPercentage" type="number" {...register("discountPercentage", { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="installmentAvailable" onCheckedChange={(checked) => setValue("installmentAvailable", checked)} checked={watch("installmentAvailable")}/>
                    <Label htmlFor="installmentAvailable">Installment Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="discountAvailable" onCheckedChange={(checked) => setValue("discountAvailable", checked)} checked={watch("discountAvailable")}/>
                    <Label htmlFor="discountAvailable">Discount Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minimumAge">Minimum Age</Label>
                    <Input id="minimumAge" type="number" {...register("minimumAge", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="educationalQualification">Educational Qualification</Label>
                    <Input id="educationalQualification" {...register("educationalQualification")} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="medicalCertificateRequired" onCheckedChange={(checked) => setValue("medicalCertificateRequired", checked)} checked={watch("medicalCertificateRequired")} />
                  <Label htmlFor="medicalCertificateRequired">Medical Certificate Required</Label>
                </div>

                <div>
                  <Label>Documents Required</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newDocument} onChange={(e) => setNewDocument(e.target.value)} placeholder="Add required document" />
                    <Button type="button" onClick={() => { if (newDocument.trim()) { setDocumentsRequired([...documentsRequired, newDocument.trim()]); setNewDocument(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {documentsRequired.map((doc, idx) => (
                      <Badge key={idx} variant="secondary">
                        {doc}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setDocumentsRequired(documentsRequired.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="simulationTraining" onCheckedChange={(checked) => setValue("simulationTraining", checked)} checked={watch("simulationTraining")}/>
                    <Label htmlFor="simulationTraining">Simulation Training</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="drivingTrackAvailable" onCheckedChange={(checked) => setValue("drivingTrackAvailable", checked)} checked={watch("drivingTrackAvailable")}/>
                    <Label htmlFor="drivingTrackAvailable">Driving Track Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="pickupDropFacility" onCheckedChange={(checked) => setValue("pickupDropFacility", checked)} checked={watch("pickupDropFacility")}/>
                    <Label htmlFor="pickupDropFacility">Pickup/Drop Facility</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="studyMaterialProvided" onCheckedChange={(checked) => setValue("studyMaterialProvided", checked)} checked={watch("studyMaterialProvided")}/>
                    <Label htmlFor="studyMaterialProvided">Study Material Provided</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="onlineTestPractice" onCheckedChange={(checked) => setValue("onlineTestPractice", checked)} checked={watch("onlineTestPractice")}/>
                    <Label htmlFor="onlineTestPractice">Online Test Practice</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="rtoTestAssistance" onCheckedChange={(checked) => setValue("rtoTestAssistance", checked)} checked={watch("rtoTestAssistance")}/>
                    <Label htmlFor="rtoTestAssistance">RTO Test Assistance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="dualControlVehicles" onCheckedChange={(checked) => setValue("dualControlVehicles", checked)} checked={watch("dualControlVehicles")}/>
                    <Label htmlFor="dualControlVehicles">Dual Control Vehicles</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="weekendBatches" onCheckedChange={(checked) => setValue("weekendBatches", checked)} checked={watch("weekendBatches")}/>
                    <Label htmlFor="weekendBatches">Weekend Batches</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="vehicleCondition">Vehicle Condition</Label>
                  <Select onValueChange={(value) => setValue("vehicleCondition", value)} defaultValue={editingClass?.vehicleCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Training Vehicles</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newVehicle} onChange={(e) => setNewVehicle(e.target.value)} placeholder="Add vehicle" />
                    <Button type="button" onClick={() => { if (newVehicle.trim()) { setTrainingVehicles([...trainingVehicles, newVehicle.trim()]); setNewVehicle(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trainingVehicles.map((vehicle, idx) => (
                      <Badge key={idx} variant="secondary">
                        {vehicle}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setTrainingVehicles(trainingVehicles.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Batch Information */}
            <Card>
              <CardHeader>
                <CardTitle>Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Input id="batchSize" type="number" {...register("batchSize", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="currentBatchSeats">Current Batch Seats</Label>
                    <Input id="currentBatchSeats" type="number" {...register("currentBatchSeats", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="nextBatchStartDate">Next Batch Start Date</Label>
                    <Input id="nextBatchStartDate" type="date" {...register("nextBatchStartDate")} />
                  </div>

                  <div>
                    <Label htmlFor="classTimings">Class Timings</Label>
                    <Input id="classTimings" {...register("classTimings")} placeholder="e.g., 9 AM - 5 PM" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="successRatePercentage">Success Rate (%)</Label>
                    <Input id="successRatePercentage" type="number" {...register("successRatePercentage", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="totalStudentsTrained">Total Students Trained</Label>
                    <Input id="totalStudentsTrained" type="number" {...register("totalStudentsTrained", { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="certificationProvided" onCheckedChange={(checked) => setValue("certificationProvided", checked)} checked={watch("certificationProvided")}/>
                    <Label htmlFor="certificationProvided">Certification Provided</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="governmentCertified" onCheckedChange={(checked) => setValue("governmentCertified", checked)} checked={watch("governmentCertified")}/>
                    <Label htmlFor="governmentCertified">Government Certified</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Location</CardTitle>
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

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  </div>

                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" {...register("whatsappNumber")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" {...register("country", { required: true })} />
                  </div>

                  <div>
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Input id="stateProvince" {...register("stateProvince")} />
                  </div>

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
                  <Label htmlFor="fullAddress">Full Address *</Label>
                  <Textarea id="fullAddress" {...register("fullAddress", { required: true })} rows={2} />
                </div>

                <div>
                  <Label htmlFor="trainingCenterAddress">Training Center Address</Label>
                  <Textarea id="trainingCenterAddress" {...register("trainingCenterAddress")} rows={2} />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="mt-2" />
                  {uploadingImages && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                </div>
                {images && images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {images.map((img: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-24  rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="jobPlacementAssistance" onCheckedChange={(checked) => setValue("jobPlacementAssistance", checked)} checked={watch("jobPlacementAssistance")}/>
                    <Label htmlFor="jobPlacementAssistance">Job Placement Assistance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="refresherCourseAvailable" onCheckedChange={(checked) => setValue("refresherCourseAvailable", checked)} checked={watch("refresherCourseAvailable")}/>
                    <Label htmlFor="refresherCourseAvailable">Refresher Course Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="internationalLicenseTraining" onCheckedChange={(checked) => setValue("internationalLicenseTraining", checked)} checked={watch("internationalLicenseTraining")}/>
                    <Label htmlFor="internationalLicenseTraining">International License Training</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="femaleInstructorAvailable" onCheckedChange={(checked) => setValue("femaleInstructorAvailable", checked)} checked={watch("femaleInstructorAvailable")}/>
                    <Label htmlFor="femaleInstructorAvailable">Female Instructor Available</Label>
                  </div>
                </div>

                <div>
                  <Label>Language Options</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} placeholder="Add language" />
                    <Button type="button" onClick={() => { if (newLanguage.trim()) { setLanguageOptions([...languageOptions, newLanguage.trim()]); setNewLanguage(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((lang, idx) => (
                      <Badge key={idx} variant="secondary">
                        {lang}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setLanguageOptions(languageOptions.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" onCheckedChange={(checked) => setValue("isActive", checked)} checked={watch("isActive")}/>
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" onCheckedChange={(checked) => setValue("isFeatured", checked)} checked={watch("isFeatured")}/>
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isVerified" onCheckedChange={(checked) => setValue("isVerified", checked)} checked={watch("isVerified")}/>
                    <Label htmlFor="isVerified">Verified</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : editingClass ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingClass?.title}</DialogTitle>
          </DialogHeader>
          {viewingClass && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge>{viewingClass.licenseClass}</Badge>
                <Badge variant="secondary">{viewingClass.vehicleType}</Badge>
                <Badge variant="outline">{viewingClass.licenseType}</Badge>
                {viewingClass.isRtoApproved && <Badge className="bg-green-500">RTO Approved</Badge>}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{viewingClass.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Course Fee</h3>
                  <p className="text-lg font-bold text-primary">₹{viewingClass.courseFee}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p>{viewingClass.courseDurationDays} days</p>
                </div>
              </div>

              {viewingClass.images && viewingClass.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingClass.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Class Image ${idx + 1}`} className="w-full h-24  rounded" />
                    ))}
                  </div>
                </div>
              )}

              {viewingClass.successRatePercentage && (
                <div>
                  <h3 className="font-semibold mb-2">Success Rate</h3>
                  <p>{viewingClass.successRatePercentage}%</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Classes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((licenseClass: any) => (
          <Card key={licenseClass.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{licenseClass.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{licenseClass.licenseClass}</Badge>
                    {licenseClass.isRtoApproved && <Badge className="bg-green-500">RTO Approved</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(licenseClass)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(licenseClass)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(licenseClass.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {licenseClass.description && <p className="text-sm text-muted-foreground line-clamp-2">{licenseClass.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{licenseClass.courseFee}</span>
                  <Badge variant={licenseClass.isActive ? "default" : "secondary"}>
                    {licenseClass.availabilityStatus}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration: {licenseClass.courseDurationDays} days
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No License Classes Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first license training class</p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add License Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}