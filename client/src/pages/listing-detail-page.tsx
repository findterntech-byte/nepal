import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ListingDetail from "@/components/listing-detail";
import { getConfigForType } from "@/lib/listing-config";

export default function GenericListingDetailPage() {
  const params = useParams();
  const type = (params as any).type as string | undefined;
  const id = (params as any).id as string | undefined;

  const cfg = type ? getConfigForType(type) : undefined;

  const { data: listing, isLoading } = useQuery({
    queryKey: ["/api/generic", type, id],
    enabled: !!type && !!id,
    queryFn: async () => {
      if (!type || !id) return null;
      // Use configured API if present, otherwise fallback
      const base = cfg?.apiBase || `/api/admin/${type}`;
      const resp = await fetch(`${base}/${id}`);
      if (!resp.ok) throw new Error("Failed to fetch listing");
      return resp.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Loading listing...</div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Listing not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ListingDetail
        listing={listing}
        titleField={cfg?.titleField || "title"}
        subtitleField={cfg?.subtitleField || "contactPerson"}
        showFields={cfg?.defaultFields}
      />
      <Footer />
    </div>
  );
}
