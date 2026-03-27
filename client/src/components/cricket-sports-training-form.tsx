
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
import { Plus, Edit, Trash2, Eye, MapPin, Building, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const initialFormData = {
  title: '',
  description: '',
  listingType: 'individual' as const,
  trainingCategory: 'batting' as const,
  academyName: '',
  coachName: '',
  coachExperienceYears: 0,
  coachCertifications: '',
  coachAchievements: '',
  pricePerSession: 0,
  pricePerMonth: 0,
  pricePerQuarter: 0,
  currency: 'INR',
  discountPercentage: 0,
  trainingLevel: 'all_levels' as const,
  ageGroup: '',
  minAge: 0,
  maxAge: 0,
  batchSize: 0,
  sessionDurationMinutes: 60,
  sessionsPerWeek: 0,
  indoorFacility: false,
  outdoorFacility: false,
  netPracticeAvailable: false,
  pitchAvailable: false,
  equipmentProvided: false,
  facilities: [] as string[],
  equipmentList: [] as string[],
  trainingModules: [] as string[],
  specializations: [] as string[],
  tournamentPreparation: false,
  matchPractice: false,
  videoAnalysis: false,
  fitnessTraining: false,
  mentalConditioning: false,
  trainingDays: [] as string[],
  morningBatch: false,
  eveningBatch: false,
  weekendBatch: false,
  flexibleTiming: false,
  certificateProvided: false,
  successStories: '',
  studentsTrained: 0,
  professionalPlayersProduced: 0,
  freeTrialAvailable: false,
  trialSessions: 0,
  registrationFee: 0,
  admissionProcess: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  alternatePhone: '',
  whatsappAvailable: false,
  whatsappNumber: '',
  websiteUrl: '',
  city: '',
  stateProvince: '',
  areaName: '',
  fullAddress: '',
  country: 'India',
  images: [] as string[],
  videos: [] as string[],
  brochureUrl: '',
  hostelFacility: false,
  transportFacility: false,
  dietPlanIncluded: false,
  scholarshipAvailable: false,
  internationalExposure: false,
  isActive: true,
  isFeatured: false,
};

export default function CricketSportsTrainingForm() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadingImages, setUploadingImages] = useState(false);
  const queryClient = useQueryClient();

  const uploadMultipleImages = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return [];
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

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/admin/cricket-sports-training'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/cricket-sports-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cricket-sports-training'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cricket-sports-training'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cricket-sports-training'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle active status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cricket-sports-training'] });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle featured status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cricket-sports-training'] });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({ ...initialFormData, ...item, images: Array.isArray(item?.images) ? item.images : [] });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cricket Sports Training</h2>
          <p className="text-muted-foreground">Manage cricket coaching and training programs</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Training Program
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add New'} Cricket Training Program</DialogTitle>
            <DialogDescription>Fill in the details below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="col-span-2">
                <Label>Images</Label>
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
                      setFormData((prev) => ({
                        ...prev,
                        images: [...(Array.isArray(prev.images) ? prev.images : []), ...(urls || [])],
                      }));
                      e.target.value = '';
                    } catch (err: any) {
                      console.error('Image upload error:', err);
                      alert(err?.message || 'Failed to upload images');
                    } finally {
                      setUploadingImages(false);
                    }
                  }}
                />

                {Array.isArray(formData.images) && formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((url, idx) => (
                      <Badge key={`${url}-${idx}`} variant="secondary" className="max-w-full">
                        <span className="truncate max-w-[240px] inline-block">{url}</span>
                        <X
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() => setFormData((prev) => ({
                            ...prev,
                            images: (Array.isArray(prev.images) ? prev.images : []).filter((_, i) => i !== idx),
                          }))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Listing Type *</Label>
                <Select value={formData.listingType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, listingType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Coaching</SelectItem>
                    <SelectItem value="group">Group Coaching</SelectItem>
                    <SelectItem value="academy">Cricket Academy</SelectItem>
                    <SelectItem value="coaching_camp">Coaching Camp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Training Category *</Label>
                <Select value={formData.trainingCategory} onValueChange={(value: any) => setFormData(prev => ({ ...prev, trainingCategory: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batting">Batting</SelectItem>
                    <SelectItem value="bowling">Bowling</SelectItem>
                    <SelectItem value="wicket_keeping">Wicket Keeping</SelectItem>
                    <SelectItem value="fielding">Fielding</SelectItem>
                    <SelectItem value="all_rounder">All Rounder</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Academy Name</Label>
                <Input
                  value={formData.academyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, academyName: e.target.value }))}
                />
              </div>

              <div>
                <Label>Coach Name *</Label>
                <Input
                  value={formData.coachName}
                  onChange={(e) => setFormData(prev => ({ ...prev, coachName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label>Coach Experience (Years)</Label>
                <Input
                  type="number"
                  value={formData.coachExperienceYears}
                  onChange={(e) => setFormData(prev => ({ ...prev, coachExperienceYears: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Training Level</Label>
                <Select value={formData.trainingLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, trainingLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price Per Session (₹)</Label>
                <Input
                  type="number"
                  value={formData.pricePerSession}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerSession: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Price Per Month (₹)</Label>
                <Input
                  type="number"
                  value={formData.pricePerMonth}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerMonth: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Batch Size</Label>
                <Input
                  type="number"
                  value={formData.batchSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Session Duration (Minutes)</Label>
                <Input
                  type="number"
                  value={formData.sessionDurationMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, sessionDurationMinutes: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Sessions Per Week</Label>
                <Input
                  type="number"
                  value={formData.sessionsPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, sessionsPerWeek: parseInt(e.target.value) }))}
                />
              </div>

              <div className="col-span-2">
                <Label className="mb-4">Facilities</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.indoorFacility}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, indoorFacility: checked }))}
                    />
                    <Label>Indoor Facility</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.outdoorFacility}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, outdoorFacility: checked }))}
                    />
                    <Label>Outdoor Facility</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.netPracticeAvailable}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, netPracticeAvailable: checked }))}
                    />
                    <Label>Net Practice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.pitchAvailable}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pitchAvailable: checked }))}
                    />
                    <Label>Pitch Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.equipmentProvided}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, equipmentProvided: checked }))}
                    />
                    <Label>Equipment Provided</Label>
                  </div>
                </div>
              </div>

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
                    <Badge variant="secondary">{item.trainingCategory}</Badge>
                    <Badge variant="outline">{item.listingType}</Badge>
                    {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewingItem(item); setShowDetailsDialog(true); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">
                    ₹{item.pricePerMonth || item.pricePerSession}/mo
                  </span>
                  <Badge variant={item.isActive ? 'default' : 'secondary'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {item.coachName && (
                  <div className="text-sm">
                    <span className="font-medium">Coach: </span>
                    <span className="text-muted-foreground">{item.coachName}</span>
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
            <h3 className="text-lg font-semibold mb-2">No Training Programs Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first cricket training program</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Training Program
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
