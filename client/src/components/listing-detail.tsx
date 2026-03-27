import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Mail, Phone, Instagram, Facebook, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  listing: any;
  titleField?: string; // e.g. 'title' or 'name'
  subtitleField?: string; // e.g. 'tutorName' or 'contactPerson'
  showFields?: string[]; // explicit list of fields to show in details grid
  featureKeys?: string[]; // optional list of boolean feature keys to show as badges
};

function prettyKey(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b(\w)/g, (s) => s.toUpperCase());
}

export default function ListingDetail({ listing, titleField = "title", subtitleField = "contactPerson", showFields, featureKeys }: Props) {
  if (!listing) return null;

  const ownerId = (listing.userId || listing.sellerId) as string | undefined;

  const { data: ownerUser } = useQuery({
    queryKey: ["users", ownerId],
    enabled: Boolean(ownerId && typeof ownerId === "string" && ownerId.length > 0),
    queryFn: async () => {
      const res = await fetch(`/api/users/${ownerId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  const contactName =
    (ownerUser?.firstName || ownerUser?.lastName
      ? [ownerUser?.firstName, ownerUser?.lastName].filter(Boolean).join(" ")
      : ownerUser?.username || ownerUser?.name) ||
    listing.contactPerson ||
    "—";

  const contactPhone = ownerUser?.phone || listing.contactPhone;
  const contactEmail = ownerUser?.email || listing.contactEmail;
  const instagramUrl = ownerUser?.instagramUrl;
  const facebookUrl = ownerUser?.facebookUrl;
  const tiktokUrl = ownerUser?.tiktokUrl;

  const whatsappNumber = typeof contactPhone === "string" ? contactPhone.replace(/[^\d]/g, "") : "";
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  const resolvedCountry = useMemo(() => {
    const listingCountryRaw = listing?.country;
    const listingCountry = typeof listingCountryRaw === "string" ? listingCountryRaw.trim() : "";
    const ownerCountryRaw = ownerUser?.country;
    const ownerCountry = typeof ownerCountryRaw === "string" ? ownerCountryRaw.trim() : "";

    if (!listingCountry && ownerCountry) return ownerCountry;
    if (listingCountry.toLowerCase() === "india" && ownerCountry && ownerCountry.toLowerCase() !== "india") return ownerCountry;
    return listingCountry || "—";
  }, [listing?.country, ownerUser?.country]);

  const resolvedStateProvince = useMemo(() => {
    const listingStateRaw = listing?.stateProvince;
    const listingState = typeof listingStateRaw === "string" ? listingStateRaw.trim() : "";
    const ownerStateRaw = ownerUser?.state;
    const ownerState = typeof ownerStateRaw === "string" ? ownerStateRaw.trim() : "";

    return listingState || ownerState || "—";
  }, [listing?.stateProvince, ownerUser?.state]);

  const hasPrice = typeof listing.price === "number" || (typeof listing.price === "string" && String(listing.price).trim().length > 0);
  const numericPrice = hasPrice ? Number(listing.price) : NaN;
  const formattedPrice = !isNaN(numericPrice) ? `₹${numericPrice.toLocaleString()}` : hasPrice ? `₹${String(listing.price)}` : "";

  // Derive all keys from the listing object so we can optionally show everything
  const allKeysFromListing = useMemo(() => {
    try {
      return Object.keys(listing).filter(Boolean).sort((a, b) => a.localeCompare(b));
    } catch (e) {
      return [] as string[];
    }
  }, [listing]);

  const derivedFieldsFromListing = useMemo(() => {
    const excluded = new Set([
      "id",
      "images",
      "videos",
      "documents",
      "attachments",
      "description",
     
    ]);

    const preferredOrder = [
      titleField,
      subtitleField,
      "listingType",
      "category",
      "subcategory",
      "productType",
      "brand",
      "model",
      "price",
      "feePerMonth",
      "feePerHour",
      "feePerSubject",
      "rentalPricePerDay",
      "rentalPricePerMonth",
      "country",
      "stateProvince",
      "city",
      "areaName",
      "fullAddress",
      "contactPerson",
      "contactPhone",
      "contactEmail",
      "isActive",
      "isFeatured",
      "isVerified",
      "viewCount",
     
    ].filter(Boolean);

    const keys = Object.keys(listing || {}).filter((k) => k && !excluded.has(k));
    const ordered = [...new Set([...preferredOrder, ...keys])].filter((k) => Object.prototype.hasOwnProperty.call(listing, k));
    return ordered;
  }, [listing, subtitleField, titleField]);

  const fields = showFields && showFields.length > 0 ? showFields : derivedFieldsFromListing;

  const [showAllFields, setShowAllFields] = useState(false);
  const [fieldFilter, setFieldFilter] = useState("");

  const visibleFields = useMemo(() => {
    const source = showAllFields ? allKeysFromListing : fields;
    const normalized = (source || []).filter(Boolean).map((k) => String(k));
    if (fieldFilter && fieldFilter.trim().length > 0) {
      const q = fieldFilter.trim().toLowerCase();
      return normalized.filter((k) => k.toLowerCase().includes(q));
    }
    return normalized;
  }, [showAllFields, allKeysFromListing, fields, fieldFilter]);

  const formatValue = (v: any): React.ReactNode => {
    if (v == null) return "—";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (typeof v === "object") return <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(v, null, 2)}</pre>;
    // Dates
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleString();
    // Numbers representing money
    if (typeof v === "number") return v.toString();
    return String(v);
  };

  const valueForField = (field: string) => {
    if (field === "country") return resolvedCountry;
    if (field === "stateProvince") return resolvedStateProvince;
    return (listing as any)?.[field];
  };

  // Image gallery logic
  const images: string[] = Array.isArray(listing.images)
    ? listing.images
    : listing.images && typeof listing.images === "string"
    ? [listing.images]
    : listing.images && typeof listing.images === "object"
    ? Object.values(listing.images as Record<string, any>).filter(Boolean).map(String)
    : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = images.length ? images[currentImageIndex] : undefined;

  const defaultFeatureKeys = [
    "demoClassAvailable",
    "studyMaterialProvided",
    "testSeriesIncluded",
    "doubtClearingSessions",
    "flexibleTimings",
    "weekendClasses",
    "homeTuitionAvailable",
    "onlineClassesAvailable",
  ];

  const resolvedFeatureKeys = featureKeys ?? defaultFeatureKeys.filter((k) => Object.prototype.hasOwnProperty.call(listing, k));

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{listing[titleField] || listing.name || "Details"}</h1>
          {listing[subtitleField] && <div className="text-sm text-muted-foreground">{listing[subtitleField]}</div>}
          {hasPrice ? (
            <div className="mt-3 text-2xl font-bold text-green-700">{formattedPrice}</div>
          ) : null}
          {listing.feePerMonth || listing.feePerHour || listing.feePerSubject ? (
            <div className="mt-3 text-xl font-semibold text-green-700">
              {listing.feePerMonth ? `₹${Number(listing.feePerMonth).toLocaleString()}/month` : listing.feePerHour ? `₹${Number(listing.feePerHour).toLocaleString()}/hr` : listing.feePerSubject ? `₹${Number(listing.feePerSubject).toLocaleString()}/subject` : null}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white p-4 rounded shadow">
              <div className="relative">
                {currentImage ? (
                  <div className="w-full aspect-video rounded overflow-hidden bg-gray-50">
                    <img
                      src={currentImage}
                      alt={listing[titleField] || "listing image"}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                ) : (
                  <div className="w-full h-72 md:h-96 bg-gray-100 flex items-center justify-center rounded">No Image</div>
                )}

                {/* Prev/Next controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((idx) => (idx - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                      aria-label="previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((idx) => (idx + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                      aria-label="next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto mt-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        idx === currentImageIndex ? "border-[#0B8457] shadow-md" : "border-gray-200/50 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${listing[titleField] || "listing"} ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {listing.description ? (
              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>
            ) : null}

            {listing.subjectsOffered && listing.subjectsOffered.length > 0 ? (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.subjectsOffered.map((s: string, i: number) => (
                    <Badge key={i} className="bg-gray-100 text-gray-800">{s}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">Details</h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input id="showAllFields" type="checkbox" checked={showAllFields} onChange={(e) => setShowAllFields(e.target.checked)} />
                    <span>Show all fields</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)} placeholder="Filter fields" className="px-2 py-1 border rounded text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleFields.map((f) => (
                  <React.Fragment key={f}>
                    <div className="text-sm text-muted-foreground">{prettyKey(f)}</div>
                    <div className="font-medium">{formatValue(valueForField(f))}</div>
                  </React.Fragment>
                ))}
              </div>

              {resolvedFeatureKeys.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {resolvedFeatureKeys.map((k) => (
                    <div key={k} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className={`inline-block w-2 h-2 rounded-full ${(listing as any)[k] ? "bg-green-500" : "bg-gray-400"}`}></span>
                      <span className="text-sm">{prettyKey(k)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
             
              <div className="text-sm font-semibold">Contact</div>
              <div className="mt-1 text-sm text-muted-foreground font-medium">{contactName}</div>
              {ownerUser?.role || ownerUser?.accountType ? (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {[ownerUser?.role, ownerUser?.accountType].filter(Boolean).join(" • ")}
                </div>
              ) : null}
              {contactPhone ? (
                <a
                  href={`tel:${String(contactPhone).replace(/\s+/g, "")}`}
                  className="block mt-3 w-full text-center text-sm bg-[#0B8457] hover:bg-[#0a7750] text-white px-3 py-2 rounded-md"
                >
                  <Phone className="inline-block mr-2 w-4 h-4" />Call
                </a>
              ) : null}
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="block mt-2 w-full text-center text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"><Phone className="inline-block mr-2 w-4 h-4"/>WhatsApp</a>
              ) : null}
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className="block mt-2 w-full text-center text-sm bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-md"><Mail className="inline-block mr-2 w-4 h-4"/>Email</a>
              ) : null}

              {instagramUrl || facebookUrl || tiktokUrl ? (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {instagramUrl ? (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center text-sm border border-gray-200 hover:border-gray-300 bg-white text-gray-800 px-3 py-2 rounded-md"
                    >
                      <Instagram className="inline-block mr-2 w-4 h-4" />Instagram
                    </a>
                  ) : null}
                  {facebookUrl ? (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center text-sm border border-gray-200 hover:border-gray-300 bg-white text-gray-800 px-3 py-2 rounded-md"
                    >
                      <Facebook className="inline-block mr-2 w-4 h-4" />Facebook
                    </a>
                  ) : null}
                  {tiktokUrl ? (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center text-sm border border-gray-200 hover:border-gray-300 bg-white text-gray-800 px-3 py-2 rounded-md"
                    >
                      <Video className="inline-block mr-2 w-4 h-4" />TikTok
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Stats</div>
                <div className="text-sm text-muted-foreground">{listing.isActive ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}</div>
              </div>

              <div className="mt-2 text-sm text-muted-foreground space-y-1">
                <div>{listing.isFeatured ? <Badge className="mr-2">Featured</Badge> : null}</div>
             
                <div>Location: <span className="font-medium">{[ownerUser?.area, ownerUser?.city,  ownerUser?.country].filter(Boolean).join(", ") || '—'}</span></div>
                <div>Address: <span className="font-medium">{listing.fullAddress || '—'}</span></div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
