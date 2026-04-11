import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, Ticket, X } from "lucide-react";

type EventTicketFormData = {
  title: string;
  description?: string;
  eventType: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  venueName?: string;
  venueAddress?: string;
  city: string;
  state?: string;
  country?: string;
  eventDate?: string;
  eventEndDate?: string;
  eventTime?: string;
  eventEndTime?: string;
  ticketPriceMin?: number;
  ticketPriceMax?: number;
  priceRange?: string;
  bookingOpen?: boolean;
  earlyBirdAvailable?: boolean;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  groupDiscount?: boolean;
  studentDiscount?: boolean;
  seniorDiscount?: boolean;
  childDiscount?: boolean;
  freeEntry?: boolean;
  vipSeating?: boolean;
  generalSeating?: boolean;
  standingTicket?: boolean;
  onlineBooking?: boolean;
  offlineBooking?: boolean;
  homeDelivery?: boolean;
  payAtVenue?: boolean;
  instantConfirmation?: boolean;
  refundAvailable?: boolean;
  ageRestriction?: string;
  language?: string;
  duration?: string;
  organizerName?: string;
  artistPerformer?: string;
  category?: string[];
  tags?: string;
  featuredEvent?: boolean;
  popularEvent?: boolean;
  capacity?: number;
  seatsAvailable?: number;
  soldCount?: number;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};


export default function EventTicketBookingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<EventTicketFormData>();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["event-tickets"],
    queryFn: async () => {
      const response = await fetch("/api/admin/event-tickets");
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventTicketFormData) => {
      const response = await fetch("/api/admin/event-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create event");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-tickets"] });
      toast({ title: "Success", description: "Event/Ticket created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventTicketFormData }) => {
      const response = await fetch(`/api/admin/event-tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update event");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-tickets"] });
      toast({ title: "Success", description: "Event/Ticket updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/event-tickets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-tickets"] });
      toast({ title: "Success", description: "Event/Ticket deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    reset();
    setImages([]);
    setImageError(null);
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setImages(service.images || []);
    setImageError(null);
    Object.keys(service).forEach((key) => {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        setValue(key as any, service[key]);
      }
    });
    setIsDialogOpen(true);
  };

  const handleView = (service: any) => {
    setViewingService(service);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteMutation.mutate(id);
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload-multiple", { method: "POST", body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    const urls = Array.isArray(data?.files) ? data.files.map((x: any) => x?.url).filter((u: any) => typeof u === "string") : [];
    if (urls.length === 0) throw new Error("Upload failed: missing files");
    return urls as string[];
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingImages(true);
    setImageError(null);
    try {
      const urls = await uploadMultipleFiles(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setImageError(err.message);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EventTicketFormData) => {
    const payload = { ...data, images };
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event & Movie Ticket Booking</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.businessName}</p>
                </div>
                <div className="flex gap-1">
                  {service.featuredEvent && <Badge>Featured</Badge>}
                  {service.popularEvent && <Badge variant="secondary">Popular</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Type:</strong> {service.eventType}</p>
                <p className="text-sm"><strong>Date:</strong> {service.eventDate || "TBA"}</p>
                <p className="text-sm"><strong>Location:</strong> {service.city}, {service.state}</p>
                <p className="text-sm"><strong>Price:</strong> {service.freeEntry ? "Free" : `₹${service.ticketPriceMin} - ₹${service.ticketPriceMax}`}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleView(service)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">No events found. Add your first event!</div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit" : "Add"} Event/Movie Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Event/Movie Title *</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Event/Movie Name" />
              </div>
              <div>
                <Label htmlFor="businessName">Organizer/Company</Label>
                <Input id="businessName" {...register("businessName")} placeholder="Organizer Name" />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select onValueChange={(value) => setValue("eventType", value)} defaultValue={editingService?.eventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Movie">Movie</SelectItem>
                    <SelectItem value="Concert">Concert</SelectItem>
                    <SelectItem value="Theater">Theater</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Comedy Show">Comedy Show</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="Contact Person" />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input id="contactPhone" {...register("contactPhone", { required: true })} placeholder="Phone Number" />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="Email Address" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register("website")} placeholder="Website URL" />
              </div>
              <div>
                <Label htmlFor="venueName">Venue Name</Label>
                <Input id="venueName" {...register("venueName")} placeholder="Theater/Stadium Name" />
              </div>
              <div>
                <Label htmlFor="venueAddress">Venue Address</Label>
                <Input id="venueAddress" {...register("venueAddress")} placeholder="Venue Address" />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city", { required: true })} placeholder="City" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} placeholder="State" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} defaultValue="India" placeholder="Country" />
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input id="eventDate" type="date" {...register("eventDate")} />
              </div>
              <div>
                <Label htmlFor="eventEndDate">End Date (if multi-day)</Label>
                <Input id="eventEndDate" type="date" {...register("eventEndDate")} />
              </div>
              <div>
                <Label htmlFor="eventTime">Start Time</Label>
                <Input id="eventTime" type="time" {...register("eventTime")} />
              </div>
              <div>
                <Label htmlFor="eventEndTime">End Time</Label>
                <Input id="eventEndTime" type="time" {...register("eventEndTime")} />
              </div>
              <div>
                <Label htmlFor="ticketPriceMin">Min Price (₹)</Label>
                <Input id="ticketPriceMin" type="number" {...register("ticketPriceMin")} placeholder="Minimum Price" />
              </div>
              <div>
                <Label htmlFor="ticketPriceMax">Max Price (₹)</Label>
                <Input id="ticketPriceMax" type="number" {...register("ticketPriceMax")} placeholder="Maximum Price" />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" {...register("capacity")} placeholder="Total Seats" />
              </div>
              <div>
                <Label htmlFor="organizerName">Organizer Name</Label>
                <Input id="organizerName" {...register("organizerName")} placeholder="Event Organizer" />
              </div>
              <div>
                <Label htmlFor="artistPerformer">Artist/Performer</Label>
                <Input id="artistPerformer" {...register("artistPerformer")} placeholder="Cast/Crew/Artists" />
              </div>
              <div>
                <Label htmlFor="ageRestriction">Age Restriction</Label>
                <Input id="ageRestriction" {...register("ageRestriction")} placeholder="e.g. 18+, U/A, U" />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input id="language" {...register("language")} placeholder="Hindi, English, etc." />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" {...register("duration")} placeholder="2h 30m" />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Ticket Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "vipSeating", "generalSeating", "standingTicket", "freeEntry"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Discount Options</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "earlyBirdAvailable", "groupDiscount", "studentDiscount", "seniorDiscount", "childDiscount"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Booking Options</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "onlineBooking", "offlineBooking", "homeDelivery", "payAtVenue", "instantConfirmation", "refundAvailable"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Event Status</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "bookingOpen", "featuredEvent", "popularEvent"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" {...register(item as any)} id={item} className="w-4 h-4" />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Describe your event..." rows={4} />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" {...register("tags")} placeholder="music, live, entertainment" />
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-24 h-24 object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-primary">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                </label>
              </div>
              {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
              {uploadingImages && <p className="text-blue-500 text-sm mt-1">Uploading images...</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isActive")} id="isActive" className="w-4 h-4" defaultChecked={editingService?.isActive ?? true} />
                <Label htmlFor="isActive" className="font-normal">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isFeatured")} id="isFeatured" className="w-4 h-4" defaultChecked={editingService?.isFeatured ?? false} />
                <Label htmlFor="isFeatured" className="font-normal">Featured</Label>
              </div>
            </div>

            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingService ? "Update Event" : "Create Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingService} onOpenChange={() => setViewingService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingService?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewingService?.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {viewingService.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`Event ${idx + 1}`} className="w-full h-40 object-cover rounded-md" />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Event Type:</strong> {viewingService?.eventType}</div>
              <div><strong>Date:</strong> {viewingService?.eventDate || "TBA"}</div>
              <div><strong>Time:</strong> {viewingService?.eventTime || "TBA"}</div>
              <div><strong>Venue:</strong> {viewingService?.venueName || "N/A"}</div>
              <div><strong>Location:</strong> {viewingService?.city}, {viewingService?.state}</div>
              <div><strong>Price:</strong> {viewingService?.freeEntry ? "Free" : `₹${viewingService?.ticketPriceMin} - ₹${viewingService?.ticketPriceMax}`}</div>
              <div><strong>Contact:</strong> {viewingService?.contactPhone}</div>
              <div><strong>Organizer:</strong> {viewingService?.organizerName || viewingService?.businessName}</div>
            </div>
            {viewingService?.description && (
              <div><strong>Description:</strong><p className="mt-1">{viewingService.description}</p></div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}