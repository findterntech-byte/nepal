import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

type SliderCard = {
  id: number;
  title?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function SliderCardPage() {
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
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Slider Cards</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="py-6">Loading slider cards...</div>}
        {error && <div className="text-red-600 py-4">Error: {error}</div>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((slider) => (
                <TableRow key={slider.id}>
                  <TableCell>{slider.id}</TableCell>
                  <TableCell>{slider.title || '-'}</TableCell>
                  <TableCell>
                    {slider.imageUrl ? (
                      <img
                        src={slider.imageUrl.startsWith('http') ? slider.imageUrl : slider.imageUrl}
                        alt={slider.title || 'slider image'}
                        className="w-28 h-16  rounded"
                      />
                    ) : (
                      <span className="text-muted">No image</span>
                    )}
                  </TableCell>
                  <TableCell>{slider.status || '-'}</TableCell>
                  <TableCell>{slider.createdAt ? new Date(slider.createdAt).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
