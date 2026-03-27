
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

function titleize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_+|\-+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

export default function SkilledLabourDetailPage() {
  const params = useParams();
  const profileId = (params as any).profileId as string | undefined;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pro-profile-detail", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      return fetchJson(`/api/pro-profiles/${profileId}`);
    },
  });

  const displayName = useMemo(() => {
    const u = data?.user || {};
    return (
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      safeString(data?.values?.fullName) ||
      safeString(data?.values?.name) ||
      "Pro Profile"
    );
  }, [data]);

  const photoUrl =
    safeString(data?.values?.profilePhoto) ||
    safeString(data?.values?.photo) ||
    safeString(data?.values?.logo) ||
    safeString(data?.user?.avatar);

  const headline =
    safeString(data?.values?.designation) ||
    safeString(data?.values?.headline) ||
    safeString(data?.values?.businessName) ||
    safeString(data?.values?.username);

  const contact =
    safeString(data?.user?.phone) ||
    safeString(data?.values?.contactDetails) ||
    safeString(data?.values?.contactInfo);

  const email =
    safeString(data?.user?.email) ||
    safeString(data?.values?.email) ||
    safeString(data?.values?.contactEmail);

  const location =
    safeString(data?.user?.city) ||
    safeString(data?.user?.state) ||
    safeString(data?.user?.country) ||
    safeString(data?.values?.location);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{String((error as any)?.message || error || "Profile not found")}</div>
          <div className="mt-6">
            <div className="flex justify-center gap-2">
              <Button onClick={() => refetch()}>Retry</Button>
              <Link href="/skilled-labour">
                <Button variant="outline">Back</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const fields = Array.isArray(data.fields) ? data.fields : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Skilled Labour</div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
          </div>
          <Link href="/skilled-labour">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 overflow-hidden">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full aspect-square rounded-xl bg-gray-100 overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt={displayName} className="w-full h-full " />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No photo</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Type</div>
                <Badge variant="secondary">{data.profileType?.name || "Pro"}</Badge>
              </div>

              {headline && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Headline</div>
                  <div className="text-sm font-medium">{headline}</div>
                </div>
              )}

              {location && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="text-sm">{location}</div>
                </div>
              )}

              {contact && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Contact</div>
                  <div className="text-sm">{contact}</div>
                </div>
              )}

              {email && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-sm break-all">{email}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {email ? (
                  <div className="p-4 rounded-xl border bg-white">
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="mt-2 text-sm font-medium break-all">{email}</div>
                  </div>
                ) : null}
                {fields
                  .filter((f: any) => {
                    const v = f?.value;
                    if (v == null) return false;
                    if (typeof v === "string" && v.trim() === "") return false;
                    if (Array.isArray(v) && v.length === 0) return false;

                    const key = String(f?.field?.key || "").toLowerCase();
                    const label = String(f?.field?.label || "").toLowerCase();
                    if (
                      key === "profilephoto" ||
                      key === "profile_photo" ||
                      key === "photo" ||
                      key === "avatar" ||
                      label.includes("profile photo")
                    ) {
                      return false;
                    }

                    return true;
                  })
                  .map((f: any) => {
                    const label = f?.field?.label || titleize(String(f?.field?.key || ""));
                    const value = f?.value;
                    const fieldType = String(f?.field?.fieldType || "");

                    if (fieldType === "textarea") {
                      return (
                        <div key={f.field?.id || label} className="md:col-span-2 p-4 rounded-xl border bg-white">
                          <div className="text-xs text-muted-foreground">{label}</div>
                          <div className="mt-2 text-sm whitespace-pre-wrap">{safeString(value)}</div>
                        </div>
                      );
                    }

                    if (fieldType === "image") {
                      const url = safeString(value);
                      return (
                        <div key={f.field?.id || label} className="p-4 rounded-xl border bg-white">
                          <div className="text-xs text-muted-foreground">{label}</div>
                          <div className="mt-3 w-full aspect-video rounded-lg bg-gray-100 overflow-hidden">
                            {url ? (
                              <img src={url} alt={label} className="w-full h-full " />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No image</div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (fieldType === "images") {
                      const urls = Array.isArray(value) ? value.map((x) => safeString(x)).filter(Boolean) : [];
                      return (
                        <div key={f.field?.id || label} className="md:col-span-2 p-4 rounded-xl border bg-white">
                          <div className="text-xs text-muted-foreground">{label}</div>
                          {urls.length === 0 ? (
                            <div className="mt-2 text-sm text-muted-foreground">No images</div>
                          ) : (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                              {urls.map((u, idx) => (
                                <div key={idx} className="aspect-video rounded-lg bg-gray-100 overflow-hidden">
                                  <img src={u} alt={`${label}-${idx}`} className="w-full h-full " />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                  

                   

                    return (
                      <div key={f.field?.id || label} className="p-4 rounded-xl border bg-white">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="mt-2 text-sm font-medium">{safeString(value) || "-"}</div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
