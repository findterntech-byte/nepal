import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, X, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EbooksOnlineCoursesForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [topicsCovered, setTopicsCovered] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  const [newOutcome, setNewOutcome] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const { data: items = [] } = useQuery({
    queryKey: ["/api/admin/ebooks-online-courses"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ebooks-online-courses");
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/ebooks-online-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ebooks-online-courses"] });
      toast({ title: "Success", description: "Item created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/ebooks-online-courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ebooks-online-courses"] });
      toast({ title: "Success", description: "Item updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/ebooks-online-courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ebooks-online-courses"] });
      toast({ title: "Success", description: "Item deleted successfully" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/ebooks-online-courses/${id}/toggle-active`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to toggle active status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ebooks-online-courses"] });
    },
  });

  const resetForm = () => {
    reset();
    setEditingItem(null);
    setTopicsCovered([]);
    setLearningOutcomes([]);
    setPrerequisites([]);
    setImages([]);
    setImageError(null);
    setUploadingImages(false);
    setNewTopic("");
    setNewOutcome("");
    setNewPrerequisite("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      topicsCovered,
      learningOutcomes,
      prerequisites,
      images,
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage) : null,
      publicationYear: data.publicationYear ? parseInt(data.publicationYear) : null,
      pageCount: data.pageCount ? parseInt(data.pageCount) : null,
      fileSizeMb: data.fileSizeMb ? parseFloat(data.fileSizeMb) : null,
      courseDurationHours: data.courseDurationHours ? parseFloat(data.courseDurationHours) : null,
      totalLectures: data.totalLectures ? parseInt(data.totalLectures) : null,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setTopicsCovered(item.topicsCovered || []);
    setLearningOutcomes(item.learningOutcomes || []);
    setPrerequisites(item.prerequisites || []);
    setImages(item.images || []);
    Object.keys(item).forEach((key) => {
      setValue(key, item[key]);
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!allowed.includes(f.type)) {
        setImageError('Only JPG, PNG, WEBP and GIF allowed');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (f.size > maxSize) {
        setImageError('Each image must be <= 5MB');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    const remaining = 10 - images.length;
    if (remaining <= 0) {
      setImageError('Maximum 10 images allowed');
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    void (async () => {
      try {
        setUploadingImages(true);
        const fd = new FormData();
        picked.forEach((f) => fd.append('files', f));
        const res = await fetch('/api/admin/upload-multiple', {
          method: 'POST',
          body: fd,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((json as any)?.message || 'Failed to upload images');
        const urls: string[] = Array.isArray((json as any)?.files)
          ? (json as any).files.map((f: any) => f?.url).filter((u: any) => typeof u === 'string')
          : [];
        if (urls.length === 0) throw new Error('Failed to upload images');
        setImages((prev) => [...prev, ...urls].slice(0, 10));
        setImageError(null);
      } catch (e: any) {
        console.error(e);
        setImageError(e?.message || 'Failed to upload images');
      } finally {
        setUploadingImages(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    })();
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); processFiles(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
  const openFileDialog = () => fileInputRef.current?.click();
  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">E-Books & Online Courses</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} E-Book/Course</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" {...register("title", { required: true })} />
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
                      <input ref={fileInputRef} type="file" accept="image/*" multiple disabled={uploadingImages} onChange={(e) => processFiles(e.target.files)} className="hidden" />
                      {uploadingImages && <p className="text-sm text-muted-foreground">Uploading...</p>}
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
                    <Label htmlFor="listingType">Listing Type *</Label>
                    <Select onValueChange={(value) => setValue("listingType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ebook">E-Book</SelectItem>
                        <SelectItem value="online_course">Online Course</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="skill_development">Skill Development</SelectItem>
                        <SelectItem value="hobby">Hobby</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="health">Health & Fitness</SelectItem>
                        <SelectItem value="creative">Creative Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input id="subcategory" {...register("subcategory")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E-Book Details */}
            <Card>
              <CardHeader>
                <CardTitle>E-Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bookTitle">Book Title</Label>
                    <Input id="bookTitle" {...register("bookTitle")} />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" {...register("author")} />
                  </div>
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input id="publisher" {...register("publisher")} />
                  </div>
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" {...register("isbn")} />
                  </div>
                  <div>
                    <Label htmlFor="publicationYear">Publication Year</Label>
                    <Input id="publicationYear" type="number" {...register("publicationYear")} />
                  </div>
                  <div>
                    <Label htmlFor="pageCount">Page Count</Label>
                    <Input id="pageCount" type="number" {...register("pageCount")} />
                  </div>
                  <div>
                    <Label htmlFor="fileFormat">File Format</Label>
                    <Select onValueChange={(value) => setValue("fileFormat", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="epub">EPUB</SelectItem>
                        <SelectItem value="mobi">MOBI</SelectItem>
                        <SelectItem value="azw3">AZW3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fileSizeMb">File Size (MB)</Label>
                    <Input id="fileSizeMb" type="number" step="0.01" {...register("fileSizeMb")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input id="courseTitle" {...register("courseTitle")} />
                  </div>
                  <div>
                    <Label htmlFor="instructorName">Instructor Name</Label>
                    <Input id="instructorName" {...register("instructorName")} />
                  </div>
                  <div>
                    <Label htmlFor="courseDurationHours">Duration (Hours)</Label>
                    <Input id="courseDurationHours" type="number" step="0.5" {...register("courseDurationHours")} />
                  </div>
                  <div>
                    <Label htmlFor="totalLectures">Total Lectures</Label>
                    <Input id="totalLectures" type="number" {...register("totalLectures")} />
                  </div>
                  <div>
                    <Label htmlFor="courseLevel">Course Level</Label>
                    <Select onValueChange={(value) => setValue("courseLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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
                    <Label htmlFor="courseLanguage">Language</Label>
                    <Input id="courseLanguage" {...register("courseLanguage")} />
                  </div>
                </div>

                <div>
                  <Label>Topics Covered</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Add topic" />
                    <Button type="button" onClick={() => { if (newTopic.trim()) { setTopicsCovered([...topicsCovered, newTopic.trim()]); setNewTopic(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topicsCovered.map((topic, idx) => (
                      <Badge key={idx} variant="secondary">
                        {topic}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setTopicsCovered(topicsCovered.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Learning Outcomes</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newOutcome} onChange={(e) => setNewOutcome(e.target.value)} placeholder="Add outcome" />
                    <Button type="button" onClick={() => { if (newOutcome.trim()) { setLearningOutcomes([...learningOutcomes, newOutcome.trim()]); setNewOutcome(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {learningOutcomes.map((outcome, idx) => (
                      <Badge key={idx} variant="secondary">
                        {outcome}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Prerequisites</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={newPrerequisite} onChange={(e) => setNewPrerequisite(e.target.value)} placeholder="Add prerequisite" />
                    <Button type="button" onClick={() => { if (newPrerequisite.trim()) { setPrerequisites([...prerequisites, newPrerequisite.trim()]); setNewPrerequisite(""); } }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prerequisites.map((prereq, idx) => (
                      <Badge key={idx} variant="secondary">
                        {prereq}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPrerequisites(prerequisites.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
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
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input id="price" type="number" step="0.01" {...register("price", { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input id="originalPrice" type="number" step="0.01" {...register("originalPrice")} />
                  </div>
                  <div>
                    <Label htmlFor="discountPercentage">Discount %</Label>
                    <Input id="discountPercentage" type="number" step="0.01" {...register("discountPercentage")} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                 
                  <div className="flex items-center space-x-2">
                    <Switch id="lifetimeAccess" onCheckedChange={(checked) => setValue("lifetimeAccess", checked)} />
                    <Label htmlFor="lifetimeAccess">Lifetime Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="certificateProvided" onCheckedChange={(checked) => setValue("certificateProvided", checked)} />
                    <Label htmlFor="certificateProvided">Certificate</Label>
                  </div>
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
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input id="contactPhone" {...register("contactPhone", { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>
                  <div>
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Input id="stateProvince" {...register("stateProvince")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingItem?.title}</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Type</h3>
                  <Badge>{viewingItem.listingType}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <Badge variant="secondary">{viewingItem.category}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Price</h3>
                  <p className="text-lg font-bold text-primary">₹{viewingItem.price}</p>
                </div>
                {viewingItem.instructorName && (
                  <div>
                    <h3 className="font-semibold mb-2">Instructor</h3>
                    <p>{viewingItem.instructorName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Items List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{item.listingType}</Badge>
                    <Badge>{item.category}</Badge>
                    {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                {item.listingType === "ebook" ? (
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-primary">₹{item.price}</span>
                </div>
                {item.author && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Author:</span>
                    <span>{item.author}</span>
                  </div>
                )}
                {item.instructorName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span>{item.instructorName}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setViewingItem(item)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActiveMutation.mutate(item.id)}>
                    <Switch checked={item.isActive} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}