import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProProfileType {
  id: string;
  name: string;
  slug: string;
}

const PROFILE_TYPE_COLORS: Record<string, string> = {
  'business-profile': '#1E3A5F',
  'freelancing-profile': '#7C3AED',
  'matrimony-profile': '#E75480',
  'social-media-influencer-profile': '#F97316',
  'company-organization-profile': '#2563EB',
  'student-profile': '#EAB308',
  'doctor-medical-profile': '#16A34A',
  'teacher-trainer-profile': '#8B5A2B',
  'personal-general-profile': '#6B7280',
  'artist-creator-profile': '#DB2777',
  'ngo-trust-profile': '#15803D',
};

function getProfileTypeColor(profileType?: Partial<ProProfileType> | null): string | undefined {
  const slug = typeof profileType?.slug === 'string' ? profileType.slug : '';
  if (slug && PROFILE_TYPE_COLORS[slug]) return PROFILE_TYPE_COLORS[slug];
  const name = (typeof profileType?.name === 'string' ? profileType.name : '').toLowerCase();
  if (!name) return undefined;
  if (name.includes('business')) return PROFILE_TYPE_COLORS['business-profile'];
  if (name.includes('freelanc')) return PROFILE_TYPE_COLORS['freelancing-profile'];
  if (name.includes('matrimony')) return PROFILE_TYPE_COLORS['matrimony-profile'];
  if (name.includes('influencer') || name.includes('social media')) return PROFILE_TYPE_COLORS['social-media-influencer-profile'];
  if (name.includes('company') || name.includes('organization')) return PROFILE_TYPE_COLORS['company-organization-profile'];
  if (name.includes('student')) return PROFILE_TYPE_COLORS['student-profile'];
  if (name.includes('doctor') || name.includes('medical')) return PROFILE_TYPE_COLORS['doctor-medical-profile'];
  if (name.includes('teacher') || name.includes('trainer')) return PROFILE_TYPE_COLORS['teacher-trainer-profile'];
  if (name.includes('personal') || name.includes('general')) return PROFILE_TYPE_COLORS['personal-general-profile'];
  if (name.includes('artist') || name.includes('creator')) return PROFILE_TYPE_COLORS['artist-creator-profile'];
  if (name.includes('ngo') || name.includes('trust')) return PROFILE_TYPE_COLORS['ngo-trust-profile'];
  return undefined;
}

function getBadgeTextColor(bgHex: string): string {
  const h = bgHex.replace('#', '').trim();
  if (h.length !== 6) return '#ffffff';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.68 ? '#111827' : '#ffffff';
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (!ct.toLowerCase().includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Server did not return JSON. Please restart the server (port 5000) and try again.\n\n${text.slice(0, 200)}`
    );
  }
  return res.json();
}

interface ProDirectoryItem {
  profile: {
    id: string;
    userId: string;
    profileTypeId: string;
    createdAt?: string;
    updatedAt?: string;
  };
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    accountType?: string;
    avatar?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  profileType: ProProfileType;
  values: Record<string, any>;
}

function safeString(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map((x) => safeString(x)).filter(Boolean).join(", ");
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export default function SkilledLabourPage() {
  const [, setLocation] = useLocation();
  const [typeId, setTypeId] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [debouncedQ, setDebouncedQ] = useState<string>("");

  const { data: types = [] } = useQuery<ProProfileType[]>({
    queryKey: ["pro-profile-types"],
    queryFn: async () => {
      const data = await fetchJson("/api/pro-profile/types");
      return Array.isArray(data) ? data : [];
    },
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (typeId) params.set("typeId", typeId);
    if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
    return params.toString();
  }, [typeId, debouncedQ]);

  const { data, isLoading, isError, error, refetch } = useQuery<{ total: number; items: ProDirectoryItem[] }>({
    queryKey: ["pro-profiles", typeId, debouncedQ],
    queryFn: async () => {
      return fetchJson(`/api/pro-profiles?${queryParams}`);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Skilled Labour</h1>
              <p className="text-sm text-muted-foreground mt-1">All Pro profiles directory with filters.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setLocation("/")}>Back</Button>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Pro-Profile Type</Label>
              <Select value={typeId} onValueChange={(v) => setTypeId(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {types
                    .filter((t: any) => t?.isActive !== false)
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, skills, etc..." />
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={() => refetch()}>Refresh</Button>
            </div>
          </CardContent>
        </Card>

        {isError && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Unable to load profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">{String((error as any)?.message || error)}</div>
              <div className="flex gap-2">
                <Button onClick={() => refetch()}>Retry</Button>
                <Button variant="outline" onClick={() => setLocation("/")}>Back</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total: {data?.total ?? 0}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(data?.items || []).map((item) => {
                const displayName =
                  [item.user.firstName, item.user.lastName].filter(Boolean).join(" ") ||
                  safeString(item.values.fullName) ||
                  safeString(item.values.name) ||
                  "Pro Profile";
                const headline =
                  safeString(item.values.designation) ||
                  safeString(item.values.headline) ||
                  safeString(item.values.businessName) ||
                  safeString(item.values.username);
                const locationText =
                  safeString(item.user.city) ||
                  safeString(item.user.state) ||
                  safeString(item.user.country) ||
                  safeString(item.values.location);
                const skills = safeString(item.values.skills);
                const photo =
                  safeString(item.values.profilePhoto) ||
                  safeString(item.values.photo) ||
                  safeString(item.values.logo) ||
                  safeString(item.user.avatar);

                const typeColor = getProfileTypeColor(item.profileType);
                const typeText = typeColor ? getBadgeTextColor(typeColor) : undefined;

                return (
                  <button
                    key={item.profile.id}
                    onClick={() => setLocation(`/skilled-labour/${item.profile.id}`)}
                    className="text-left"
                  >
                    <Card
                      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                      style={typeColor ? { borderColor: typeColor } : undefined}
                    >
                      {typeColor ? (
                        <div className="h-1 w-full" style={{ backgroundColor: typeColor }} />
                      ) : null}
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {photo ? (
                              <img src={photo} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No</div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base truncate">{displayName}</CardTitle>
                            <div className="mt-1">
                              <Badge
                                variant="secondary"
                                className="text-xs border-0"
                                style={
                                  typeColor
                                    ? { backgroundColor: typeColor, color: typeText }
                                    : undefined
                                }
                              >
                                {item.profileType?.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {headline && <div className="text-sm font-medium line-clamp-1">{headline}</div>}
                        {locationText && <div className="text-xs text-muted-foreground line-clamp-1">{locationText}</div>}
                        {skills && <div className="text-xs text-muted-foreground line-clamp-2">Skills: {skills}</div>}
                        {item.user.phone && <div className="text-xs">Contact: {item.user.phone}</div>}
                      </CardContent>
                    </Card>
                  </button>
                );
              })}
            </div>

            {(data?.items || []).length === 0 && (
              <div className="text-sm text-muted-foreground">No pro profiles found.</div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
