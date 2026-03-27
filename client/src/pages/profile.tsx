
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User, Mail, Phone, MapPin, Calendar, Edit, LogOut, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  accountType?: string;
  role: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  address?: string;
  postalCode?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

type ProProfileType = {
  id: string;
  name: string;
  slug: string;
  isActive?: boolean;
};

type ProProfileField = {
  id: string;
  profileTypeId: string;
  key: string;
  label: string;
  fieldType: string;
  isRequired?: boolean;
  placeholder?: string;
  options?: any[];
};

export default function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [proProfile, setProProfile] = useState<any | null>(null);
  const [proProfileType, setProProfileType] = useState<ProProfileType | null>(null);
  const [proProfileTypes, setProProfileTypes] = useState<ProProfileType[]>([]);
  const [proProfileFields, setProProfileFields] = useState<ProProfileField[]>([]);
  const [proProfileValues, setProProfileValues] = useState<Record<string, any>>({});
  const [isProProfileOpen, setIsProProfileOpen] = useState(false);
  const [isSavingProProfile, setIsSavingProProfile] = useState(false);
  const [isTogglingProProfile, setIsTogglingProProfile] = useState(false);
  const [uploadingProFieldKey, setUploadingProFieldKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    area: "",
    address: "",
    postalCode: "",
    avatar: "",
  });

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLocation("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLocation("/login");
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => {
    if (!user) return;
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
      area: user.area || "",
      address: user.address || "",
      postalCode: user.postalCode || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (user.accountType !== "pro") return;

    const load = async () => {
      try {
        const resp = await fetch(`/api/pro-profile/me?userId=${encodeURIComponent(user.id)}`);
        const data = await resp.json();
        if (!resp.ok) {
          console.error("Failed to load pro profile:", data);
          return;
        }
        setProProfile(data?.profile || null);
        setProProfileType(data?.profileType || null);
        setProProfileValues((data?.values && typeof data.values === "object") ? data.values : {});
      } catch (e) {
        console.error("Failed to load pro profile:", e);
      }
    };

    load();
  }, [user]);

  useEffect(() => {
    if (!isProProfileOpen) return;
    if (!user) return;
    if (user.accountType !== "pro") return;

    const loadTypes = async () => {
      try {
        const resp = await fetch("/api/pro-profile/types");
        const data = await resp.json();
        if (resp.ok) setProProfileTypes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load pro profile types:", e);
      }
    };

    loadTypes();
  }, [isProProfileOpen, user]);

  useEffect(() => {
    if (!isProProfileOpen) return;
    const typeId = proProfile?.profileTypeId;
    if (!typeId) {
      setProProfileFields([]);
      return;
    }

    const loadFields = async () => {
      try {
        const resp = await fetch(`/api/pro-profile/types/${encodeURIComponent(typeId)}/fields`);
        const data = await resp.json();
        if (!resp.ok) {
          console.error("Failed to load pro profile fields:", data);
          setProProfileFields([]);
          return;
        }
        setProProfileType(data?.type || proProfileType || null);
        setProProfileFields(Array.isArray(data?.fields) ? data.fields : []);
      } catch (e) {
        console.error("Failed to load pro profile fields:", e);
        setProProfileFields([]);
      }
    };

    loadFields();
  }, [isProProfileOpen, proProfile?.profileTypeId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    if (!data?.url || typeof data.url !== "string") throw new Error("Upload failed: missing url");
    return data.url;
  };

  const handleToggleProProfile = async () => {
    if (!user) return;
    if (user.accountType !== "pro") return;
    if (!proProfile) {
      alert("Pro profile not found");
      return;
    }

    const nextActive = !(proProfile?.isActive === false);
    const confirmText = nextActive
      ? "Are you sure you want to deactivate your pro profile? It will not appear in Skilled Labour listing."
      : "Activate your pro profile to show it in Skilled Labour listing?";

    if (!confirm(confirmText)) return;

    setIsTogglingProProfile(true);
    try {
      const resp = await fetch("/api/pro-profile/toggle-active", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data?.message || "Failed to update status");
        return;
      }
      setProProfile((p: any) => ({ ...(p || {}), isActive: data?.isActive }));
    } catch (e) {
      console.error("Toggle pro profile error:", e);
      alert("Something went wrong");
    } finally {
      setIsTogglingProProfile(false);
    }
  };

  const handleSaveProProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (user.accountType !== "pro") return;
    const typeId = proProfile?.profileTypeId;
    if (!typeId) {
      alert("Please select Pro-Profile type");
      return;
    }

    setIsSavingProProfile(true);
    try {
      const resp = await fetch("/api/pro-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, profileTypeId: typeId, values: proProfileValues }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data?.message || "Failed to save pro profile");
        return;
      }
      setIsProProfileOpen(false);
    } catch (e) {
      console.error("Save pro profile error:", e);
      alert("Something went wrong");
    } finally {
      setIsSavingProProfile(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const resp = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          country: editForm.country,
          state: editForm.state,
          city: editForm.city,
          area: editForm.area,
          address: editForm.address,
          postalCode: editForm.postalCode,
          avatar: editForm.avatar,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        alert(data?.message || "Failed to update profile");
        return;
      }

      const merged = { ...user, ...data };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setIsEditOpen(false);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const headerAvatarUrl =
    (user.accountType === "pro"
      ? (typeof proProfileValues.profilePhoto === "string" && proProfileValues.profilePhoto.trim() ? proProfileValues.profilePhoto.trim() :
         typeof proProfileValues.photo === "string" && proProfileValues.photo.trim() ? proProfileValues.photo.trim() :
         typeof proProfileValues.logo === "string" && proProfileValues.logo.trim() ? proProfileValues.logo.trim() :
         typeof proProfileValues.avatar === "string" && proProfileValues.avatar.trim() ? proProfileValues.avatar.trim() :
         "")
      : "") ||
    (user.avatar && user.avatar.trim() ? user.avatar.trim() : "");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {headerAvatarUrl ? (
                      <img src={headerAvatarUrl} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.firstName?.[0] || user.username[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username}
                    </h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role}
                      </Badge>
                      {user.accountType && (
                        <Badge variant="outline">{user.accountType}</Badge>
                      )}
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  {user.accountType === "pro" ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsProProfileOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Pro Profile
                      </Button>
                      <Button
                        variant={proProfile?.isActive === false ? "default" : "destructive"}
                        size="sm"
                        onClick={handleToggleProProfile}
                        disabled={isTogglingProProfile}
                      >
                        {proProfile?.isActive === false ? "Activate Pro Profile" : "Deactivate Pro Profile"}
                      </Button>
                    </>
                  ) : null}
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isProProfileOpen} onOpenChange={setIsProProfileOpen}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit Pro Profile</DialogTitle>
                <DialogDescription>Update your professional profile details.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveProProfile} className="space-y-5">
                <div className="space-y-2">
                  <Label>Profile Type</Label>
                  <Input value={proProfileType?.name || ""} readOnly />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(proProfileFields || []).map((f) => {
                    const key = String(f.key);
                    const label = f.label || key;
                    const v = proProfileValues[key];
                    const fieldType = String(f.fieldType || "text");
                    const isUploading = uploadingProFieldKey === key;

                    if (fieldType === "textarea") {
                      return (
                        <div key={f.id} className="sm:col-span-2 space-y-2">
                          <Label>{label}</Label>
                          <Textarea
                            value={typeof v === "string" ? v : (v == null ? "" : String(v))}
                            onChange={(e) => setProProfileValues((p) => ({ ...p, [key]: e.target.value }))}
                            rows={4}
                          />
                        </div>
                      );
                    }

                    if (fieldType === "image") {
                      const currentUrl = typeof v === "string" ? v : "";
                      const inputId = `pro-profile-upload-${key}`;
                      return (
                        <div key={f.id} className="space-y-2">
                          <Label>{label}</Label>

                          <div className="flex items-center gap-2">
                            <Input value={currentUrl} readOnly placeholder={f.placeholder || ""} />
                            <input
                              id={inputId}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.currentTarget.value = "";
                                if (!file) return;
                                setUploadingProFieldKey(key);
                                try {
                                  const url = await uploadSingleFile(file);
                                  setProProfileValues((p) => ({ ...p, [key]: url }));
                                } catch (err: any) {
                                  console.error(err);
                                  alert(err?.message || "Upload failed");
                                } finally {
                                  setUploadingProFieldKey(null);
                                }
                              }}
                            />
                            <Button type="button" variant="outline" disabled={isUploading} onClick={() => document.getElementById(inputId)?.click()}>
                              <Upload className="w-4 h-4 mr-2" />
                              {isUploading ? "Uploading..." : "Upload"}
                            </Button>
                          </div>

                          {currentUrl ? (
                            <div className="mt-2 space-y-2">
                              <div className="w-full aspect-video rounded-lg bg-gray-100 overflow-hidden border">
                                <img src={currentUrl} alt={label} className="w-full h-full object-contain" />
                              </div>
                              <Button type="button" variant="outline" size="sm" onClick={() => setProProfileValues((p) => ({ ...p, [key]: "" }))}>
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      );
                    }

                    if (fieldType === "images") {
                      const currentUrls = Array.isArray(v) ? v.map(String).filter(Boolean) : [];
                      const inputId = `pro-profile-upload-multi-${key}`;

                      return (
                        <div key={f.id} className="sm:col-span-2 space-y-2">
                          <Label>{label}</Label>
                          <div className="flex items-center gap-2">
                            <input
                              id={inputId}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                e.currentTarget.value = "";
                                if (files.length === 0) return;

                                setUploadingProFieldKey(key);
                                try {
                                  const uploaded: string[] = [];
                                  for (const file of files) {
                                    const url = await uploadSingleFile(file);
                                    uploaded.push(url);
                                  }

                                  setProProfileValues((p) => {
                                    const prev = Array.isArray(p[key]) ? (p[key] as any[]).map(String).filter(Boolean) : [];
                                    const merged = [...prev, ...uploaded].slice(0, 10);
                                    return { ...p, [key]: merged };
                                  });
                                } catch (err: any) {
                                  console.error(err);
                                  alert(err?.message || "Upload failed");
                                } finally {
                                  setUploadingProFieldKey(null);
                                }
                              }}
                            />

                            <Button type="button" variant="outline" disabled={isUploading} onClick={() => document.getElementById(inputId)?.click()}>
                              <Upload className="w-4 h-4 mr-2" />
                              {isUploading ? "Uploading..." : "Upload Images"}
                            </Button>
                            {currentUrls.length > 0 ? (
                              <Button type="button" variant="outline" disabled={isUploading} onClick={() => setProProfileValues((p) => ({ ...p, [key]: [] }))}>
                                <X className="w-4 h-4 mr-2" />
                                Clear
                              </Button>
                            ) : null}
                          </div>

                          {currentUrls.length > 0 ? (
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                              {currentUrls.map((u: string, idx: number) => (
                                <div key={`${u}-${idx}`} className="relative rounded-lg overflow-hidden border bg-gray-100 aspect-video">
                                  <img src={u} alt={`${label}-${idx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white border rounded-full p-1"
                                    onClick={() =>
                                      setProProfileValues((p) => {
                                        const prev = Array.isArray(p[key]) ? (p[key] as any[]).map(String).filter(Boolean) : [];
                                        const next = prev.filter((_, i) => i !== idx);
                                        return { ...p, [key]: next };
                                      })
                                    }
                                    aria-label="remove"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    }

                    return (
                      <div key={f.id} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          value={typeof v === "string" ? v : (v == null ? "" : String(v))}
                          onChange={(e) => setProProfileValues((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={f.placeholder || ""}
                        />
                      </div>
                    );
                  })}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsProProfileOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSavingProProfile}>
                    {isSavingProProfile ? "Saving..." : "Save Pro Profile"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your contact and location details.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm((p) => ({ ...p, postalCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={editForm.area}
                      onChange={(e) => setEditForm((p) => ({ ...p, area: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editForm.city}
                      onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editForm.state}
                      onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editForm.country}
                      onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm((p) => ({ ...p, avatar: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          {(user.address || user.city || user.country) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="space-y-1">
                      {user.address && <p className="font-medium">{user.address}</p>}
                      {user.area && <p className="text-sm">{user.area}</p>}
                      <p className="text-sm">
                        {[user.city, user.state, user.postalCode].filter(Boolean).join(", ")}
                      </p>
                      {user.country && <p className="text-sm">{user.country}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
