import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useWishlist from "@/hooks/useWishlist";
import { Link } from "wouter";
import { Heart, Image as ImageIcon, Trash2, X } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Wishlist</h1>
              <div className="text-sm text-muted-foreground">{items.length} saved</div>
            </div>
          </div>

          {items.length > 0 ? (
            <Button variant="outline" onClick={() => clearWishlist()} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear all
            </Button>
          ) : null}
        </div>

        {(!items || items.length === 0) ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-muted-foreground">
                Your wishlist is empty. Click the heart on any listing to save it here.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it: any) => {
              const href = (it?.href || "") as string;
              const title = (it?.title || "Untitled") as string;
              const photo = it?.photo as string | undefined;

              return (
                <Card key={it.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-44 bg-muted flex items-center justify-center overflow-hidden">
                    {photo ? (
                      <img src={photo} alt={title} className="w-full h-full  group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-200/70 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={() => removeFromWishlist(it.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 shadow flex items-center justify-center hover:bg-white"
                      title="Remove"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  <CardContent className="p-4">
                    <div className="font-semibold text-base line-clamp-2 mb-4">{title}</div>

                    <div className="flex items-center gap-2">
                      {href ? (
                        <Link href={href} className="flex-1">
                          <Button className="w-full">View Details</Button>
                        </Link>
                      ) : (
                        <Button className="w-full" disabled>
                          View Details
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => removeFromWishlist(it.id)}
                        className="gap-2"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
