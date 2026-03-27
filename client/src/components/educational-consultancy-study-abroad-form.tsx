
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, MapPin, Building, GraduationCap, X, Upload } from 'lucide-react';

const initialFormData = {
  title: '',
  description: '',
  listingType: 'consultancy' as const,
  companyName: '',
  companyType: 'consultancy' as const,
  registrationNumber: '',
  licenseNumber: '',
  establishedYear: new Date().getFullYear(),
  accreditation: '',
  affiliatedUniversities: [] as string[],
  partnerInstitutions: [] as string[],
  servicesOffered: [] as string[],
  admissionAssistance: true,
  visaAssistance: true,
  documentPreparation: true,
  applicationProcessing: true,
  scholarshipGuidance: true,
  loanAssistance: true,
  preDepartureOrientation: true,
  accommodationAssistance: true,
  careerCounseling: true,
  languageTraining: false,
  testPreparation: false,
  interviewPreparation: true,
  countriesCovered: [] as string[],
  popularDestinations: [] as string[],
  universityPartnerships: 0,
  programsOffered: [] as string[],
  undergraduatePrograms: true,
  postgraduatePrograms: true,
  doctoralPrograms: false,
  diplomaCourses: true,
  certificateCourses: true,
  professionalCourses: true,
  foundationPrograms: true,
  pathwayPrograms: true,
  engineering: false,
  medicine: false,
  businessManagement: false,
  computerScience: false,
  artsHumanities: false,
  sciences: false,
  law: false,
  architecture: false,
  design: false,
  hospitality: false,
  consultationFee: 0,
  serviceCharge: 0,
  applicationFee: 0,
  visaProcessingFee: 0,
  packagePrice: 0,
  currency: 'INR',
  freeConsultation: false,
  successRatePercentage: 0,
  studentsPlaced: 0,
  universitiesTiedUp: 0,
  countriesServed: 0,
  yearsOfExperience: 0,
  visaSuccessRate: 0,
  minimumQualification: '',
  ageCriteria: '',
  languageRequirements: '',
  testScoresRequired: [] as string[],
  minimumScoreRequirements: '',
  processingTime: '',
  counselorName: '',
  counselorQualification: '',
  counselorExperienceYears: 0,
  dedicatedCounselor: true,
  groupCounseling: false,
  onlineCounseling: true,
  inPersonCounseling: true,
  phoneSupport: true,
  emailSupport: true,
  whatsappSupport: true,
  mockInterviews: false,
  sopWriting: true,
  lorAssistance: true,
  resumeBuilding: true,
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  alternatePhone: '',
  whatsappNumber: '',
  websiteUrl: '',
  branchLocations: [] as string[],
  headOfficeAddress: '',
  consultationMode: 'both',
  appointmentRequired: true,
  walkInAllowed: false,
  country: 'India',
  stateProvince: '',
  city: '',
  areaName: '',
  fullAddress: '',
  workingHours: '',
  workingDays: '',
  images: [] as string[],
  isActive: true,
  isFeatured: false,
};

export default function EducationalConsultancyStudyAbroadForm() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [newCountry, setNewCountry] = useState('');
  const [newUniversity, setNewUniversity] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const queryClient = useQueryClient();

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    if (!data?.url || typeof data.url !== 'string') throw new Error('Upload failed: missing url');
    return data.url;
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/admin/educational-consultancy-study-abroad'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/educational-consultancy-study-abroad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/educational-consultancy-study-abroad'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/educational-consultancy-study-abroad'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/educational-consultancy-study-abroad'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle active status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/educational-consultancy-study-abroad'] });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/educational-consultancy-study-abroad/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle featured status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/educational-consultancy-study-abroad'] });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setShowForm(false);
    setNewCountry('');
    setNewUniversity('');
    setIsUploadingImages(false);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addCountry = () => {
    if (newCountry.trim() && !formData.countriesCovered.includes(newCountry.trim())) {
      setFormData(prev => ({
        ...prev,
        countriesCovered: [...prev.countriesCovered, newCountry.trim()]
      }));
      setNewCountry('');
    }
  };

  const removeCountry = (country: string) => {
    setFormData(prev => ({
      ...prev,
      countriesCovered: prev.countriesCovered.filter(c => c !== country)
    }));
  };

  const addUniversity = () => {
    if (newUniversity.trim() && !formData.affiliatedUniversities.includes(newUniversity.trim())) {
      setFormData(prev => ({
        ...prev,
        affiliatedUniversities: [...prev.affiliatedUniversities, newUniversity.trim()]
      }));
      setNewUniversity('');
    }
  };

  const removeUniversity = (university: string) => {
    setFormData(prev => ({
      ...prev,
      affiliatedUniversities: prev.affiliatedUniversities.filter(u => u !== university)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Educational Consultancy & Study Abroad</h2>
          <p className="text-muted-foreground">Manage education consultancy and study abroad services</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add New'} Educational Consultancy Service</DialogTitle>
            <DialogDescription>Fill in the details below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Listing Type *</Label>
                    <Select value={formData.listingType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, listingType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultancy">Consultancy</SelectItem>
                        <SelectItem value="admission_service">Admission Service</SelectItem>
                        <SelectItem value="visa_assistance">Visa Assistance</SelectItem>
                        <SelectItem value="complete_package">Complete Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Company Type</Label>
                    <Select value={formData.companyType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, companyType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultancy">Consultancy</SelectItem>
                        <SelectItem value="education_agent">Education Agent</SelectItem>
                        <SelectItem value="visa_consultant">Visa Consultant</SelectItem>
                        <SelectItem value="university_representative">University Representative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Company Name *</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label>Established Year</Label>
                    <Input
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Registration Number</Label>
                    <Input
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>License Number</Label>
                    <Input
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Countries & Universities */}
            <Card>
              <CardHeader>
                <CardTitle>Countries & Universities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Countries Covered</Label>
                  <div className="flex gap-2 mb-2">
                    <Input 
                      value={newCountry} 
                      onChange={(e) => setNewCountry(e.target.value)} 
                      placeholder="Add country" 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                    />
                    <Button type="button" onClick={addCountry}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.countriesCovered.map((country, idx) => (
                      <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeCountry(country)}>
                        {country} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Affiliated Universities</Label>
                  <div className="flex gap-2 mb-2">
                    <Input 
                      value={newUniversity} 
                      onChange={(e) => setNewUniversity(e.target.value)} 
                      placeholder="Add university" 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUniversity())}
                    />
                    <Button type="button" onClick={addUniversity}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.affiliatedUniversities.map((university, idx) => (
                      <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeUniversity(university)}>
                        {university} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.admissionAssistance} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, admissionAssistance: checked }))} />
                    <Label>Admission Assistance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.visaAssistance} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visaAssistance: checked }))} />
                    <Label>Visa Assistance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.documentPreparation} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, documentPreparation: checked }))} />
                    <Label>Document Preparation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.scholarshipGuidance} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, scholarshipGuidance: checked }))} />
                    <Label>Scholarship Guidance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.loanAssistance} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, loanAssistance: checked }))} />
                    <Label>Loan Assistance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={formData.careerCounseling} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, careerCounseling: checked }))} />
                    <Label>Career Counseling</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Consultation Fee (₹)</Label>
                    <Input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Service Charge (₹)</Label>
                    <Input
                      type="number"
                      value={formData.serviceCharge}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceCharge: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Package Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.packagePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, packagePrice: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.freeConsultation} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, freeConsultation: checked }))} />
                  <Label>Free Consultation</Label>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Person *</Label>
                    <Input
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Contact Phone *</Label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Website URL</Label>
                    <Input
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>State/Province</Label>
                    <Input
                      value={formData.stateProvince}
                      onChange={(e) => setFormData(prev => ({ ...prev, stateProvince: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Full Address</Label>
                    <Input
                      value={formData.fullAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    id="educational-consultancy-images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      e.currentTarget.value = '';
                      if (files.length === 0) return;
                      setIsUploadingImages(true);
                      try {
                        const uploaded: string[] = [];
                        for (const file of files) {
                          const url = await uploadSingleFile(file);
                          uploaded.push(url);
                        }
                        setFormData((prev) => {
                          const prevImgs = Array.isArray(prev.images) ? prev.images.map(String).filter(Boolean) : [];
                          const merged = [...prevImgs, ...uploaded].slice(0, 10);
                          return { ...prev, images: merged };
                        });
                      } catch (err: any) {
                        console.error(err);
                        alert(err?.message || 'Upload failed');
                      } finally {
                        setIsUploadingImages(false);
                      }
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingImages}
                    onClick={() => document.getElementById('educational-consultancy-images-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploadingImages ? 'Uploading...' : 'Upload Images'}
                  </Button>

                  {Array.isArray(formData.images) && formData.images.length > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingImages}
                      onClick={() => setFormData((prev) => ({ ...prev, images: [] }))}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  ) : null}
                </div>

                {Array.isArray(formData.images) && formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((u: string, idx: number) => (
                      <div key={`${u}-${idx}`} className="relative rounded-lg overflow-hidden border bg-gray-100 aspect-video">
                        <img src={u} alt={`img-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white border rounded-full p-1"
                          onClick={() =>
                            setFormData((prev) => {
                              const prevImgs = Array.isArray(prev.images) ? prev.images.map(String).filter(Boolean) : [];
                              const next = prevImgs.filter((_, i) => i !== idx);
                              return { ...prev, images: next };
                            })
                          }
                          aria-label="remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No images uploaded</div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(items) && items.map((item: any) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{item.listingType.replace('_', ' ')}</Badge>
                    {item.freeConsultation && <Badge className="bg-green-500">Free Consultation</Badge>}
                    {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <GraduationCap className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                <div className="text-sm">
                  <span className="font-medium">Company: </span>
                  <span className="text-muted-foreground">{item.companyName}</span>
                </div>
                {item.countriesCovered && item.countriesCovered.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.countriesCovered.slice(0, 3).map((country: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">{country}</Badge>
                    ))}
                    {item.countriesCovered.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{item.countriesCovered.length - 3} more</Badge>
                    )}
                  </div>
                )}
                {(item.city || item.areaName) && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[item.areaName, item.city].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewingItem(item); setShowDetailsDialog(true); }}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant={item.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActiveMutation.mutate(item.id)}
              >
                {item.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={item.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeaturedMutation.mutate(item.id)}
              >
                {item.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!items || items.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first educational consultancy service</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
