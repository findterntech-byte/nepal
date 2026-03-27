import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ListingDetail from "@/components/listing-detail";
import SUBCATEGORY_API_MAP from "@/lib/subcategory-mapping";
import { getConfigForType } from "@/lib/listing-config";

export default function CategoryItemDetail() {
  const params = useParams();
  const categorySlugRaw = (params as any).categorySlug as string | undefined;
  const categorySlug = categorySlugRaw ? decodeURIComponent(categorySlugRaw) : undefined;
  const id = (params as any).id as string | undefined;

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const categorySlugNormalized = categorySlug ? slugify(categorySlug) : undefined;
  const endpoint = (() => {
    if (!categorySlug) return undefined;
    // direct hit first
    if (SUBCATEGORY_API_MAP[categorySlug]) return SUBCATEGORY_API_MAP[categorySlug];

    // normalized hit (if map contains normalized keys)
    if (categorySlugNormalized && SUBCATEGORY_API_MAP[categorySlugNormalized]) {
      return SUBCATEGORY_API_MAP[categorySlugNormalized];
    }

    // best-effort: match by slugified keys (handles CamelCase keys like TuitionPrivatClasses)
    if (!categorySlugNormalized) return undefined;
    for (const [k, v] of Object.entries(SUBCATEGORY_API_MAP)) {
      if (slugify(k) === categorySlugNormalized) return v;
    }
    return undefined;
  })();
  const fallbackEndpoint = categorySlugNormalized ? `/api/admin/${categorySlugNormalized}` : undefined;

  const baseEndpoint = endpoint || fallbackEndpoint;

  const { data: listing, isLoading } = useQuery({
    queryKey: ["/api/subcategory-item", categorySlug, id],
    enabled: !!baseEndpoint && !!id,
    queryFn: async () => {
      if (!id) return null;
      if (!baseEndpoint) return null;
      const resp = await fetch(`${baseEndpoint}/${id}`);
      if (!resp.ok) throw new Error("Failed to fetch item");
      return resp.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!baseEndpoint) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Category not found</div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Item not found</div>
        <Footer />
      </div>
    );
  }

  // infer type slug from endpoint last segment
  const parts = baseEndpoint.split("/").filter(Boolean);
  const type = parts[parts.length - 1];
  const cfg = getConfigForType(type) || undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ListingDetail listing={listing} titleField={cfg?.titleField} subtitleField={cfg?.subtitleField} showFields={cfg?.defaultFields} featureKeys={cfg?.featureKeys} />
      <Footer />
    </div>
  );
}
