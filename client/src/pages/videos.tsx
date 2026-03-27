import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideosPage() {
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["videos", "all"],
    queryFn: async () => {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-videos">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <div>Loading...</div>}
            {!isLoading && error && (
              <div className="text-destructive">Failed to load videos</div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(videos || []).map((v: any) => (
                  <div key={v.id} className="border rounded-lg overflow-hidden">
                    {v.thumbnailUrl ? (
                      <div className="aspect-video bg-black">
                        <img
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="p-4 space-y-2">
                      <div className="font-semibold line-clamp-2">{v.title}</div>
                      {v.description ? (
                        <div className="text-sm text-muted-foreground line-clamp-3">
                          {v.description}
                        </div>
                      ) : null}
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline"
                      >
                        Watch
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
