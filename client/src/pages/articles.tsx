
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { FileText, Download, Share2, Bookmark, Eye, ThumbsUp, Filter, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Articles() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [articleCategories, setArticleCategories] = useState<any[]>([{ id: 'all', name: 'All Articles' }]);

  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [viewingArticle, setViewingArticle] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [savedArticles, setSavedArticles] = useState<Record<string, boolean>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDraft, setFilterDraft] = useState<string | null>(null);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);

  useEffect(() => {
    if (showDialog) {
      setDialogImageIndex(0);
    }
  }, [showDialog, viewingArticle?.id]);

  // load articles on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch("/api/articles");
        if (!mounted) return;
        if (resp.ok) {
          const json = await resp.json();
          setArticlesData(Array.isArray(json) ? json : []);
        }
      } catch (e) {
        // ignore fetch errors for now
      }
    })();
    return () => { mounted = false; };
  }, []);

  // load saved articles from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedArticles');
      if (raw) setSavedArticles(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const placeholderDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="28">No Image</text></svg>'
  )}`;

  const persistSaved = (next: Record<string, boolean>) => {
    try {
      localStorage.setItem('savedArticles', JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const handleSave = (article: any) => {
    const id = String(article.id ?? article.slug ?? article.title);
    const next = { ...savedArticles, [id]: !savedArticles[id] };
    setSavedArticles(next);
    persistSaved(next);
  };

  const handleShare = async (article: any) => {
    const url = `${window.location.origin}/articles#${article.id ?? article.slug}`;
    const text = `${article.title} - ${article.excerpt || ''}\n${url}`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: article.title, text: article.excerpt || '', url });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else {
        // fallback: open new window with the url selected
        window.prompt('Copy this link', url);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleDownload = async (article: any) => {
    // If an explicit download URL exists, use it
    const dlUrl = article.downloadUrl || article.pdfUrl || article.fileUrl;
    try {
      if (dlUrl) {
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = (article.title || 'article') + '.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      // Otherwise generate a PDF from the content/excerpt/title
      const title = String(article?.title || 'Article');
      const html = String(article?.content || article?.excerpt || '').trim();
      const plainText = html
        ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        : String(article?.excerpt || article?.title || '').trim();

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(title, pageWidth - margin * 2);
      doc.text(titleLines, margin, margin);

      let cursorY = margin + titleLines.length * 22 + 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const body = plainText || 'No content';
      const lines = doc.splitTextToSize(body, pageWidth - margin * 2);
      const lineHeight = 16;

      for (const line of lines) {
        if (cursorY > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(String(line), margin, cursorY);
        cursorY += lineHeight;
      }

      const fileNameSafe = title
        .replace(/[\\/:*?\"<>|]+/g, '')
        .trim()
        .slice(0, 80);
      doc.save(`${fileNameSafe || 'article'}.pdf`);
    } catch (e) {
      console.error('Download failed', e);
      alert('Unable to download this article');
    }
  };

  const handleDownloadAll = async () => {
    try {
      const list = filteredArticles && filteredArticles.length > 0 ? filteredArticles : articlesData;
      if (!list || list.length === 0) {
        alert('No articles available to download');
        return;
      }

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const fileLinks = list
        .map((article) => ({
          title: article?.title || 'article',
          url: article?.downloadUrl || article?.pdfUrl || article?.fileUrl,
        }))
        .filter((x) => typeof x.url === 'string' && String(x.url).trim().length > 0);

      for (const item of fileLinks) {
        try {
          const a = document.createElement('a');
          a.href = String(item.url);
          a.download = `${String(item.title).slice(0, 80)}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          await sleep(250);
        } catch (err) {
          // ignore and continue
        }
      }

      let html = `<!doctype html><html><head><meta charset="utf-8"><title>Articles</title></head><body>`;
      for (const a of list) {
        html += `<article style="margin-bottom:40px;">`;
        html += `<h1>${(a.title || '').replace(/</g, '&lt;')}</h1>`;
        html += `<p><em>By ${(a.authorName || a.author || '—')} • ${a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}</em></p>`;
        html += `<div>${(a.content || a.excerpt || '').replace(/</g, '&lt;').replace(/\n/g, '<br/>')}</div>`;
        html += `</article>`;
      }
      html += `</body></html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `articles-${(new Date()).toISOString().slice(0,10)}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download all failed', e);
      alert('Unable to download articles');
    }
  };

  const resolveImageSrc = (val?: string) => {
    if (!val) return placeholderDataUrl;
    const s = String(val || '').trim();
    if (!s) return placeholderDataUrl;
    // absolute URL
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    // root-relative path
    if (s.startsWith('/')) return s;

    // try common upload locations
    const candidates = [
      `/uploads/media/${s}`,
      `/uploads/vehicles/${s}`,
      `/uploads/${s}`,
      `/attached_assets/${s}`,
      `/assets/${s}`,
      s, // last resort - whatever the string is
    ];
    return candidates[0];
  };

  const getDialogImages = (article: any): string[] => {
    const raw: any[] = [];
    if (Array.isArray(article?.images)) raw.push(...article.images);
    if (article?.thumbnailUrl) raw.push(article.thumbnailUrl);
    if (article?.thumbnail) raw.push(article.thumbnail);
    const cleaned = raw
      .filter(Boolean)
      .map((x) => String(x))
      .map((x) => resolveImageSrc(x))
      .filter(Boolean);

    const uniq: string[] = [];
    for (const u of cleaned) {
      if (!uniq.includes(u)) uniq.push(u);
    }
    return uniq;
  };

  // load categories
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/article-categories');
        if (!mounted) return;
        if (r.ok) {
          const j = await r.json();
          if (Array.isArray(j)) setArticleCategories([{ id: 'all', name: 'All Articles' }, ...j]);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredArticles = selectedFilter && selectedFilter !== 'all'
    ? articlesData.filter(a => String(a.categoryId) === String(selectedFilter))
    : articlesData;

  const featuredArticles = filteredArticles.filter(a => !!a.isFeatured);
  const recentArticles = [...articlesData].sort((a,b) => {
    const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bd - ad;
  }).slice(0, 10);

  const topDownloads = [
    { title: "Property Buying Checklist 2025", downloads: "15.3K" },
    { title: "Home Loan Guide", downloads: "12.8K" },
    { title: "Legal Documentation Template Pack", downloads: "10.5K" },
    { title: "Property Investment Calculator", downloads: "9.2K" },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-articles">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20" data-testid="articles-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <FileText className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6" data-testid="text-articles-title">
              लेख तथा अनुसन्धान | Articles & Research
            </h1>
            <p className="text-xl opacity-90 mb-8" data-testid="text-articles-subtitle">
              In-depth guides, research papers, and resources for property buyers, sellers, and investors
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100" onClick={() => { setFilterDraft(selectedFilter === 'all' ? null : selectedFilter); setShowFilterPanel(true); }}>
                <Filter className="w-4 h-4 mr-2" />
                Filter Articles
              </Button>
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100" onClick={() => handleDownloadAll()}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Dialog */}
      <Dialog open={showFilterPanel} onOpenChange={(open) => setShowFilterPanel(open)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Filter Articles</DialogTitle>
            <DialogDescription>Choose a category to filter articles</DialogDescription>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select value={filterDraft ?? 'all'} onChange={(e) => setFilterDraft(e.target.value === 'all' ? null : e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="all">All Articles</option>
                {articleCategories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setFilterDraft(null); setSelectedFilter('all'); setShowFilterPanel(false); }}>Clear</Button>
              <Button onClick={() => { setSelectedFilter(filterDraft ?? 'all'); setShowFilterPanel(false); }}>Apply</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-12">
       

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Categories</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                    {articleCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedFilter(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          selectedFilter === category.id
                            ? "bg-purple-600 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                        <span>{category.name}</span>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>

          

          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="space-y-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="relative h-48 md:h-auto">
                        <img
                          src={resolveImageSrc(article.thumbnailUrl || article.thumbnail)}
                          alt={article.title}
                          className="w-full h-full  cursor-pointer"
                          onClick={() => { setDialogImageIndex(0); setViewingArticle(article); setShowDialog(true); }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderDataUrl; }}
                        />
                        {article.isPremium && (
                          <Badge className="absolute top-4 left-4 bg-amber-500">Premium</Badge>
                        )}
                      </div>
                      <CardContent className="md:col-span-2 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge>{article.type}</Badge>
                          <span className="text-sm text-muted-foreground">{article.pages} pages</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer" onClick={() => { setDialogImageIndex(0); setViewingArticle(article); setShowDialog(true); }}>
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <span>By {article.authorName || article.author || '—'}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {article.downloads || '0'}
                          </span>
                          {article.viewCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {article.viewCount}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {article.likes ?? 0}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleDownload(article)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button variant="outline" onClick={() => { setDialogImageIndex(0); setViewingArticle(article); setShowDialog(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Article
                          </Button>
                          <Button variant="outline" onClick={() => handleSave(article)}>
                            <Bookmark className="w-4 h-4 mr-2" />
                            {savedArticles[String(article.id ?? article.slug ?? article.title)] ? 'Saved' : 'Save'}
                          </Button>
                          <Button variant="outline" onClick={() => handleShare(article)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Publications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {recentArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <Badge className="mb-3">{article.type}</Badge>
                      <h3 className="text-lg font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                        <span onClick={() => { setDialogImageIndex(0); setViewingArticle(article); setShowDialog(true); }}>{article.title}</span>
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</span>
                        <span>{article.pages ?? 0} pages</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {article.downloads || '0'}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setDialogImageIndex(0); setViewingArticle(article); setShowDialog(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownload(article)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article View Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) { setViewingArticle(null); setDialogImageIndex(0); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingArticle?.title || 'Article'}</DialogTitle>
            <DialogDescription>{viewingArticle?.excerpt || ''}</DialogDescription>
          </DialogHeader>
          {viewingArticle ? (
            <div className="p-4 space-y-4">
              {(() => {
                const images = getDialogImages(viewingArticle);
                const hasImages = images.length > 0;
                const safeIndex = hasImages ? ((dialogImageIndex % images.length) + images.length) % images.length : 0;
                const current = hasImages ? images[safeIndex] : undefined;
                return (
                  <div className="bg-white p-3 rounded shadow">
                    <div className="relative">
                      {current ? (
                        <div className="w-full aspect-video rounded overflow-hidden bg-gray-50">
                          <img
                            src={current}
                            alt={viewingArticle.title}
                            className="w-full h-full object-contain object-center"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderDataUrl; }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-56 bg-gray-100 flex items-center justify-center rounded">No Image</div>
                      )}

                      {images.length > 1 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setDialogImageIndex((i) => i - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                            aria-label="previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDialogImageIndex((i) => i + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                            aria-label="next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      ) : null}
                    </div>

                    {images.length > 1 ? (
                      <div className="flex gap-3 overflow-x-auto mt-3">
                        {images.map((img, idx) => (
                          <button
                            type="button"
                            key={img + idx}
                            onClick={() => setDialogImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                              idx === safeIndex ? "border-purple-600 shadow-md" : "border-gray-200/50 hover:border-gray-300"
                            }`}
                          >
                            <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover object-center" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })()}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>By {viewingArticle.authorName || '—'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{viewingArticle.createdAt ? new Date(viewingArticle.createdAt).toLocaleDateString() : ''}</span>
                {viewingArticle.viewCount > 0 && (
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{viewingArticle.viewCount}</span>
                )}
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: viewingArticle.content || viewingArticle.excerpt || '' }} />
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => { setShowDialog(false); setViewingArticle(null); setDialogImageIndex(0); }}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="p-4">No article selected</div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
