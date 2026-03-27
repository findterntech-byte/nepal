import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface VideoFormProps {
  onSuccess?: () => void;
  video?: any;
}

export function VideosForm({ onSuccess, video }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    isActive: true,
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        videoUrl: video.videoUrl || '',
        thumbnailUrl: video.thumbnailUrl || '',
        duration: video.duration || '',
        isActive: video.isActive !== false,
      });
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      if (!formData.videoUrl || String(formData.videoUrl).trim().length === 0) {
        setSubmitError('Video URL is required');
        return;
      }
      const method = video ? 'PUT' : 'POST';
      const url = video ? `/api/admin/videos/${video.id}` : '/api/admin/videos';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess?.();
        setFormData({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          duration: '',
          isActive: true,
        });
      } else {
        try {
          const data = await response.json();
          setSubmitError(data?.message || 'Failed to save video');
        } catch (_e) {
          setSubmitError('Failed to save video');
        }
      }
    } catch (error) {
      console.error('Error saving video:', error);
      setSubmitError('Failed to save video');
    }
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    let url = data.url;
    // If server returned a relative path (starts with '/'), convert to absolute so the URL input (type=url) validates.
    if (typeof url === 'string' && url.startsWith('/')) {
      try {
        url = `${window.location.origin}${url}`;
      } catch (e) {
        // fallback: return as-is
      }
    }
    return url;
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadError(null);
    try {
      setUploadingVideo(true);
      const url = await uploadFile(f);
      setFormData(prev => ({ ...prev, videoUrl: url }));
    } catch (err: any) {
      console.error('Video upload error', err);
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadError(null);
    try {
      setUploadingThumbnail(true);
      const url = await uploadFile(f);
      setFormData(prev => ({ ...prev, thumbnailUrl: url }));
    } catch (err: any) {
      console.error('Thumbnail upload error', err);
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Video title"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Video description"
          rows={3}
        />
      </div>

      <div>
        <Label>Video URL *</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://example.com/video.mp4"
            required
          />
          <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
          <Button type="button" size="sm" onClick={() => videoInputRef.current?.click()}>{uploadingVideo ? 'Uploading…' : 'Upload'}</Button>
        </div>
      </div>

      <div>
        <Label>Thumbnail URL</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
          />
          <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailFileChange} className="hidden" />
          <Button type="button" size="sm" onClick={() => thumbnailInputRef.current?.click()}>{uploadingThumbnail ? 'Uploading…' : 'Upload'}</Button>
        </div>
      </div>

      <div>
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="5"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label className="mb-0">Active</Label>
      </div>

      {uploadError && <div className="text-destructive text-sm">{uploadError}</div>}
      {submitError && <div className="text-destructive text-sm">{submitError}</div>}

      <Button type="submit" className="w-full">
        {video ? 'Update Video' : 'Create Video'}
      </Button>
    </form>
  );
}
