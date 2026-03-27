import React, { useEffect, useState } from 'react';

type SliderCard = {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  status?: string;
  createdAt?: string;
};

export default function SliderCardOnlyPage() {
  const [items, setItems] = useState<SliderCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/slider-card');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Slider Cards (from /api/admin/slider-card)</h2>
      {loading && <div className="text-muted-foreground">Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && <div className="col-span-full text-muted-foreground">No slider cards found</div>}
          {items.map((c) => (
            <div key={c.id} className="border rounded-xl overflow-hidden shadow-sm bg-white">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.title || 'slider card'} className="w-full h-40 " />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">No image</div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{c.title || `Card #${c.id}`}</h3>
                {c.description && <p className="text-sm text-gray-600 mt-2">{c.description}</p>}
                <div className="mt-3 flex items-center justify-between">
                  {c.linkUrl ? (
                    <a href={c.linkUrl} className="text-sm text-white bg-[#0B8457] px-3 py-1 rounded">Open link</a>
                  ) : (
                    <span className="text-sm text-gray-400">No link</span>
                  )}
                  <span className="text-xs text-muted-foreground">{c.status || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
