import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Eye, User, Briefcase } from "lucide-react";

type ProProfileFormData = {
  profileTypeId: string;
  values: Record<string, any>;
  isActive?: boolean;
};

export default function ProProfileForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [profileValues, setProfileValues] = useState<Record<string, any>>({});

  // Fetch profile types
  const { data: profileTypes = [] } = useQuery({
    queryKey: ["pro-profile-types"],
    queryFn: async () => {
      const res = await fetch("/api/pro-profile/types");
      if (!res.ok) throw new Error("Failed to fetch profile types");
      return res.json();
    },
  });

  // Fetch fields for selected type
  const { data: typeFields = [] } = useQuery({
    queryKey: ["pro-profile-fields", selectedTypeId],
    queryFn: async () => {
      if (!selectedTypeId) return [];
      const res = await fetch(`/api/pro-profile/types/${selectedTypeId}/fields`);
      if (!res.ok) throw new Error("Failed to fetch fields");
      return res.json();
    },
    enabled: !!selectedTypeId,
  });

  // Fetch all pro profiles (for admin/seller)
  const { data: profilesResponse, isLoading } = useQuery({
    queryKey: ["pro-profiles"],
    queryFn: async () => {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      const res = await fetch("/api/pro-profiles", {
        headers: user ? {
          'x-user-id': user.id || '',
          'x-user-role': user.role || '',
          'x-account-type': user.accountType || '',
        } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch profiles");
      const data = await res.json();
      return data.items || data;
    },
  });

  const profiles = profilesResponse || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProProfileFormData) => {
      const values: Record<string, any> = {};
      typeFields.forEach((field: any) => {
        values[field.key] = profileValues[field.key] || null;
      });

      const res = await fetch("/api/pro-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileTypeId: selectedTypeId, values }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create profile");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["pro-profile-me"] });
      toast({ title: "Success", description: "Professional profile created successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ profileId, data }: { profileId: string; data: ProProfileFormData }) => {
      const values: Record<string, any> = {};
      typeFields.forEach((field: any) => {
        values[field.key] = profileValues[field.key] || null;
      });

      const res = await fetch(`/api/pro-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileTypeId: selectedTypeId, values }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["pro-profile-me"] });
      toast({ title: "Success", description: "Professional profile updated successfully" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const res = await fetch(`/api/pro-profiles/${profileId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro-profiles"] });
      toast({ title: "Success", description: "Profile deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    setSelectedTypeId("");
    setProfileValues({});
  };

  const handleEdit = (profile: any) => {
    setEditingProfile(profile);
    setSelectedTypeId(profile.profileTypeId);
    
    // Build values object from profile fields
    const values: Record<string, any> = {};
    if (profile.fields) {
      profile.fields.forEach((f: any) => {
        values[f.key] = f.value;
      });
    }
    setProfileValues(values);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedTypeId) {
      toast({ title: "Error", description: "Please select a profile type", variant: "destructive" });
      return;
    }

    if (editingProfile) {
      updateMutation.mutate({ profileId: editingProfile.id, data: { profileTypeId: selectedTypeId, values: profileValues } });
    } else {
      createMutation.mutate({ profileTypeId: selectedTypeId, values: profileValues });
    }
  };

  const renderField = (field: any) => {
    const value = profileValues[field.key] ?? "";
    
    switch (field.fieldType) {
      case "text":
      case "email":
      case "url":
      case "phone":
        return (
          <Input
            type={field.fieldType === "phone" ? "tel" : field.fieldType}
            value={value}
            onChange={(e) => setProfileValues({ ...profileValues, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            required={field.isRequired}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => setProfileValues({ ...profileValues, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            rows={3}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setProfileValues({ ...profileValues, [field.key]: e.target.value })}
            placeholder={field.placeholder}
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={(v) => setProfileValues({ ...profileValues, [field.key]: v })}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((opt: any) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={!!value}
              onCheckedChange={(checked) => setProfileValues({ ...profileValues, [field.key]: checked })}
            />
            <Label>{field.helpText || "Enable"}</Label>
          </div>
        );
      case "multiselect":
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt: any) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(value || []).includes(opt.value)}
                  onChange={(e) => {
                    const current = profileValues[field.key] || [];
                    const updated = e.target.checked
                      ? [...current, opt.value]
                      : current.filter((v: string) => v !== opt.value);
                    setProfileValues({ ...profileValues, [field.key]: updated });
                  }}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => setProfileValues({ ...profileValues, [field.key]: e.target.value })}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Professional Profile & Expertise</h2>
          <p className="text-muted-foreground">Manage professional profiles and expertise listings</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Profile
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No professional profiles found</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile: any) => (
            <Card key={profile.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-4">
                      <User className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{profile.profileTypeName || "Professional Profile"}</h3>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant={profile.isActive ? "default" : "secondary"}>
                            {profile.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {profile.userName && (
                            <Badge variant="outline">{profile.userName}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Created: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewingProfile(profile)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(profile)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this profile?")) {
                          deleteMutation.mutate(profile.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProfile ? "Edit" : "Add"} Professional Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Type *</Label>
              <Select value={selectedTypeId} onValueChange={setSelectedTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select profile type" />
                </SelectTrigger>
                <SelectContent>
                  {profileTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTypeId && typeFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {typeFields.map((field: any) => (
                    <div key={field.id} className="space-y-2">
                      <Label>
                        {field.label}
                        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderField(field)}
                      {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedTypeId && typeFields.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No fields configured for this profile type</p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingProfile ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingProfile && (
        <Dialog open={!!viewingProfile} onOpenChange={() => setViewingProfile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingProfile.profileTypeName || "Professional Profile"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={viewingProfile.isActive ? "default" : "secondary"}>
                  {viewingProfile.isActive ? "Active" : "Inactive"}
                </Badge>
                {viewingProfile.userName && (
                  <Badge variant="outline">{viewingProfile.userName}</Badge>
                )}
              </div>
              <div className="grid gap-4">
                {viewingProfile.fields?.map((field: any) => (
                  <div key={field.id}>
                    <p className="text-sm font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(field.value) ? field.value.join(", ") : field.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(viewingProfile.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(viewingProfile.updatedAt).toLocaleString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}