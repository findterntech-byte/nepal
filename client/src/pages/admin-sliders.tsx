import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SliderForm } from '@/components/slider-form';
import { Trash, Edit, Image as ImageIcon } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

export default function AdminSliders() {
  const { user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    if (userLoading) return;
    const isAdmin = !!user && (
      user.role === 'admin' ||
      user.role === 'super_admin' ||
      user.accountType === 'admin' ||
      user.accountType === 'super_admin'
    );
    if (!isAdmin) {
      setLocation('/login');
    }
  }, [user, userLoading, setLocation]);

  if (userLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const isAdmin = !!user && (
    user.role === 'admin' ||
    user.role === 'super_admin' ||
    user.accountType === 'admin' ||
    user.accountType === 'super_admin'
  );

  if (!isAdmin) {
    return <div className="p-6">Redirecting...</div>;
  }

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sliders');
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching sliders', err);
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slider?')) return;
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSliders();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sliders/${id}/toggle-active`, { method: 'PATCH' });
      if (res.ok) fetchSliders();
    } catch (err) {
      console.error('Toggle active error', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sliders</h2>
          <p className="text-muted-foreground">Manage homepage sliders (table view)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            Add Slider
          </Button>
        </div>
      </div>

      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : sliders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No sliders found</TableCell>
              </TableRow>
            ) : (
              sliders.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.title} className="w-24 h-12  rounded" />
                    ) : (
                      <div className="w-24 h-12 flex items-center justify-center bg-muted rounded">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{s.title}</TableCell>
                  <TableCell className="max-w-[40ch] line-clamp-2 text-sm text-muted-foreground">{s.description}</TableCell>
                  <TableCell>{s.sortOrder}</TableCell>
                  <TableCell>
                    {s.isActive ? <Badge className="bg-green-500">Active</Badge> : <Badge>Inactive</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(s); setShowForm(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(s.id)}>
                        {s.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Slider' : 'Add Slider'}</DialogTitle>
          </DialogHeader>
          <div>
            <SliderForm
              slider={editing}
              onCancel={() => setShowForm(false)}
              onSuccess={() => { setShowForm(false); fetchSliders(); }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
