
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Eye, Star, Heart, Share2, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";
import useWishlist from "@/hooks/useWishlist";

interface CategoryListingCardProps {
  listing: any;
  categorySlug: string;
}

export function CategoryListingCard({ listing, categorySlug }: CategoryListingCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(listing.id);
  const href = `/${categorySlug}/${listing.id}`;
  const primaryPhoto = listing.photos?.[0] || listing.images?.[0];

  const onShare = async () => {
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // ignore
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative group">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Link href={href} className="block h-full w-full">
          {primaryPhoto ? (
            <img
              src={primaryPhoto}
              alt={listing.title}
              className="h-full w-full  transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <div className="w-20 h-20 rounded-2xl bg-gray-200/70 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
            </div>
          )}
        </Link>

        <div className="absolute top-3 left-3 flex gap-2">
          {listing.isFeatured && (
            <Badge className="bg-yellow-500 text-white">Featured</Badge>
          )}
          {listing.listingType && (
            <Badge className="bg-green-600 text-white">{listing.listingType}</Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggleWishlist({ id: listing.id, title: listing.title, href, photo: primaryPhoto })}
            className={`z-10 w-9 h-9 rounded-md flex items-center justify-center shadow transition-colors ${active ? "bg-red-50" : "bg-white"}`}
            title={active ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${active ? "text-red-500" : "text-gray-700"}`} />
          </button>

          <button
            type="button"
            aria-label="Share"
            onClick={onShare}
            className="z-10 w-9 h-9 rounded-md flex items-center justify-center shadow bg-white transition-colors hover:bg-gray-50"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>

          <Link
            href={href}
            className="z-10 w-9 h-9 rounded-md flex items-center justify-center shadow bg-white transition-colors hover:bg-gray-50"
            title="View / Add"
          >
            <ShoppingCart className="w-4 h-4 text-gray-700" />
          </Link>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-semibold text-lg line-clamp-2">
            <Link href={href} className="hover:underline">
              {listing.title}
            </Link>
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {listing.description}
        </p>

        <div className="space-y-2 text-sm">
          {listing.city && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{listing.city}{listing.areaName && `, ${listing.areaName}`}</span>
            </div>
          )}

          {listing.contactPhone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{listing.contactPhone}</span>
            </div>
          )}

          {listing.contactEmail && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="line-clamp-1">{listing.contactEmail}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{listing.viewCount || 0}</span>
          </div>
          {listing.rating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{listing.rating}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4">
        <Link href={href} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
