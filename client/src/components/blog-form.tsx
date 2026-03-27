import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogFormProps {
  post?: any | null;
  categories: any[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function BlogForm({ post, categories, onCancel, onSuccess }: BlogFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setCategory(post.category || '');
      setExcerpt(post.excerpt || '');
      setContent(post.content || '');
      setCoverImageUrl(post.coverImageUrl || '');
      setTags((post.tags || []).join ? (post.tags || []).join(',') : (post.tags || ''));
      setIsPublished(!!post.isPublished);
      setIsFeatured(!!post.isFeatured);
      setSeoTitle(post.seoTitle || '');
      setSeoDescription(post.seoDescription || '');
      setAuthorName(post.authorName || '');
    } else {
      setTitle('');
      setSlug('');
      setCategory('');
      setExcerpt('');
      setContent('');
      setCoverImageUrl('');
      setTags('');
      setIsPublished(false);
      setIsFeatured(false);
      setSeoTitle('');
      setSeoDescription('');
      setAuthorName('');
    }
  }, [post]);

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({} as any));
      throw new Error(msg?.message || `Upload failed (${res.status})`);
    }
    const data = await res.json();
    if (!data?.url || typeof data.url !== 'string') throw new Error('Upload failed: missing url');
    return data.url;
  };

  const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(String(s || '').trim());

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const [meta, content] = String(dataUrl || '').split(',');
    const match = /data:([^;]+);base64/i.exec(meta || '');
    const mime = match?.[1] || 'application/octet-stream';
    const binary = atob(content || '');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };

  const handleSubmit = async () => {
    if (!title || !slug) {
      alert('Title and slug are required');
      return;
    }

    setSaving(true);
    const finalCoverImageUrl = isDataMediaUrl(coverImageUrl)
      ? await uploadSingleFile(dataUrlToFile(coverImageUrl, `cover-${Date.now()}.png`))
      : coverImageUrl;

    const payload: any = {
      title,
      slug,
      category,
      excerpt,
      content,
      coverImageUrl: finalCoverImageUrl,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublished,
      isFeatured,
      seoTitle,
      seoDescription,
      authorName,
      userId: null,
      role: 'admin',
    };

    try {
      let res;
      if (post && post.id) {
        res = await fetch(`/api/admin/blog/posts/${post.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/blog/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Failed to save');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Failed to save post', error);
      alert(error.message || 'Error saving post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Slug</Label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>

      <div>
        <Label>Category</Label>
        <Select onValueChange={(v) => setCategory(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category">{category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug || c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Excerpt</Label>
        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div>
        <Label>Content</Label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
      </div>

      <div>
        <Label>Cover Image URL</Label>
        <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
        <div className="mt-2">
          <Label htmlFor="coverImageFile" className="sr-only">Upload cover image</Label>
          <input
            id="coverImageFile"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.currentTarget.value = '';
              if (!file) return;
              setUploadingImage(true);
              try {
                const url = await uploadSingleFile(file);
                setCoverImageUrl(url);
              } catch (err) {
                console.error('Error reading image file', err);
                alert(err instanceof Error ? err.message : 'Failed to upload image');
              } finally {
                setUploadingImage(false);
              }
            }}
            className="mt-2"
          />
          {uploadingImage && <p className="text-sm text-muted-foreground mt-2">Processing image...</p>}
        </div>
        {coverImageUrl && (
          <div className="mt-3">
            <img src={coverImageUrl} alt="Cover preview" className="w-full h-40  rounded-md border" />
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" onClick={() => setCoverImageUrl('')}>Remove</Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Published</Label>
          <Switch checked={isPublished} onCheckedChange={(v: any) => setIsPublished(!!v)} />
        </div>
        <div className="flex items-center gap-2">
          <Label>Featured</Label>
          <Switch checked={isFeatured} onCheckedChange={(v: any) => setIsFeatured(!!v)} />
        </div>
      </div>

      <div>
        <Label>SEO Title</Label>
        <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
      </div>

      <div>
        <Label>SEO Description</Label>
        <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
      </div>

      <div>
        <Label>Author Name</Label>
        <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </div>
  );
}
