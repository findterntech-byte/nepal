import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Eye, Grid, List, Search, User, GraduationCap, BookOpen, Clock } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TuitionPrivateClasses() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");

  const params = useParams();
  const idParam = (params as any).id as string | undefined;

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["/api/tuition-private-classes"],
  });

  const { data: singleListing, isLoading: isSingleLoading } = useQuery({
    queryKey: ["/api/admin/tuition-private-classes", idParam],
    enabled: !!idParam,
    queryFn: async () => {
      const resp = await fetch(`/api/admin/tuition-private-classes/${idParam}`);
      if (!resp.ok) throw new Error("Failed to fetch class");
      return resp.json();
    },
  });

  const filteredListings = listings.filter((listing: any) => {
    const matchesSearch = !searchQuery ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.subjects?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === "all" || listing.city === selectedCity;
    const matchesSubject = selectedSubject === "all" || listing.subjects?.includes(selectedSubject);
    const matchesLevel = selectedLevel === "all" || listing.classLevels?.includes(selectedLevel);
    const matchesMode = selectedMode === "all" || listing.classMode === selectedMode;

    return matchesSearch && matchesCity && matchesSubject && matchesLevel && matchesMode;
  });

  const cities = Array.from(new Set(listings.map((l: any) => l.city).filter(Boolean)));
  const subjects = Array.from(new Set(listings.flatMap((l: any) => l.subjects || []).filter(Boolean)));
  const levels = Array.from(new Set(listings.flatMap((l: any) => l.classLevels || []).filter(Boolean)));

  const formatDate = (d: any) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  // If an id param is present in the route, show the detailed view for that class
  if (idParam) {
    if (isSingleLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-12 text-center">Loading class details...</div>
          <Footer />
        </div>
      );
    }

    if (!singleListing) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-12 text-center">Class not found</div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button onClick={() => window.history.back()} className="text-sm text-muted-foreground underline mb-3">← Back</button>
            <h1 className="text-3xl font-bold mb-2">{singleListing.title || singleListing.name || singleListing.tutorName}</h1>
            {(singleListing.tutorName || singleListing.contactPerson) && (
              <div className="text-sm text-muted-foreground mb-2">Tutor: <span className="font-semibold">{singleListing.tutorName || singleListing.contactPerson}</span></div>
            )}
            {(singleListing.feePerMonth || singleListing.feePerHour || singleListing.feePerSubject || singleListing.feeAmount) && (
              <div className="text-lg font-bold text-green-700">{`₹${Number(singleListing.feePerMonth || singleListing.feePerHour || singleListing.feePerSubject || singleListing.feeAmount || 0).toLocaleString()}`}{singleListing.feePerMonth ? '/month' : singleListing.feePerHour ? '/hr' : ''}</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {(singleListing.description || singleListing.summary) && (
                <div className="mb-4 bg-white p-4 rounded shadow">
                  <h2 className="font-semibold mb-2">About this class</h2>
                  <p className="text-muted-foreground">{singleListing.description || singleListing.summary}</p>
                </div>
              )}

              {/* Subjects */}
              {(singleListing.subjectsOffered && singleListing.subjectsOffered.length > 0) || (singleListing.subjects && singleListing.subjects.length > 0) ? (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {(singleListing.subjectsOffered || singleListing.subjects).map((s: string, i: number) => (
                      <Badge key={i} className="bg-gray-100 text-gray-800">{s}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-3">Class Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-sm text-muted-foreground">Listing type</div>
                  <div className="font-medium">{singleListing.listingType || '—'}</div>

                  <div className="text-sm text-muted-foreground">Subject category</div>
                  <div className="font-medium">{singleListing.subjectCategory || '—'}</div>

                  <div className="text-sm text-muted-foreground">Teaching mode</div>
                  <div className="font-medium">{singleListing.teachingMode || '—'}</div>

                  <div className="text-sm text-muted-foreground">Class type</div>
                  <div className="font-medium">{singleListing.classType || '—'}</div>

                  <div className="text-sm text-muted-foreground">Tutor qualification</div>
                  <div className="font-medium">{singleListing.tutorQualification || '—'}</div>

                  <div className="text-sm text-muted-foreground">Experience (years)</div>
                  <div className="font-medium">{singleListing.tutorExperienceYears ?? '—'}</div>

                  <div className="text-sm text-muted-foreground">Grade level</div>
                  <div className="font-medium">{singleListing.gradeLevel || (singleListing.minGrade || singleListing.maxGrade ? `${singleListing.minGrade || ''}${singleListing.minGrade && singleListing.maxGrade ? ' - ' : ''}${singleListing.maxGrade || ''}` : '—')}</div>

                  <div className="text-sm text-muted-foreground">Board</div>
                  <div className="font-medium">{singleListing.board || '—'}</div>

                  <div className="text-sm text-muted-foreground">Batch size</div>
                  <div className="font-medium">{singleListing.batchSize ?? '—'}</div>

                  <div className="text-sm text-muted-foreground">Fees</div>
                  <div className="font-medium">{singleListing.feePerMonth ? `₹${Number(singleListing.feePerMonth).toLocaleString()}/month` : singleListing.feePerHour ? `₹${Number(singleListing.feePerHour).toLocaleString()}/hr` : singleListing.feePerSubject ? `₹${Number(singleListing.feePerSubject).toLocaleString()}/subject` : '—'}</div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['demoClassAvailable','studyMaterialProvided','testSeriesIncluded','doubtClearingSessions','flexibleTimings','weekendClasses','homeTuitionAvailable','onlineClassesAvailable'].map((k) => {
                    const val = (singleListing as any)[k];
                    return (
                      <div key={k} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className={`inline-block w-2 h-2 rounded-full ${val ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-sm">{k.replace(/([A-Z])/g, ' $1').replace(/(^.|_)/g, (s) => s.toUpperCase())}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="font-semibold">Contact</div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">{singleListing.contactPerson || '—'}</div>
                  {singleListing.contactPhone && <a href={`tel:${singleListing.contactPhone}`} className="block mt-3 w-full text-center bg-green-600 text-white px-4 py-2 rounded">Call</a>}
                  {singleListing.contactEmail && <a href={`mailto:${singleListing.contactEmail}`} className="block mt-2 w-full text-center bg-gray-800 text-white px-4 py-2 rounded"><Mail className="inline-block mr-2"/> Email</a>}
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Details & Stats</div>
                  <div className="text-sm text-muted-foreground">{singleListing.isActive ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}</div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  <div className="mb-2">{singleListing.isFeatured ? <Badge className="mr-2">Featured</Badge> : null}</div>
                  <div className="mb-1">Created: <span className="font-medium">{formatDate(singleListing.createdAt)}</span></div>
                  <div className="mb-1">Updated: <span className="font-medium">{formatDate(singleListing.updatedAt)}</span></div>
                  <div className="mb-1">Location: <span className="font-medium">{[singleListing.areaName, singleListing.city, singleListing.stateProvince, singleListing.country].filter(Boolean).join(', ') || '—'}</span></div>
                  <div className="mb-1">Address: <span className="font-medium">{singleListing.fullAddress || '—'}</span></div>
                  <div className="mb-1">Posted by: <span className="font-medium">{singleListing.userId || singleListing.sellerId || '—'}</span></div>
                </div>
              </div>

            </aside>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tuition & Private Classes</h1>
          <p className="text-muted-foreground">Browse tuition & private classes listings</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tuition & private classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger>
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredListings.length} results
          </p>
          {(selectedCity !== "all" || selectedSubject !== "all" || selectedLevel !== "all" || selectedMode !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCity("all");
                setSelectedSubject("all");
                setSelectedLevel("all");
                setSelectedMode("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Listings Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tuition classes found</p>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredListings.map((listing: any) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        <a href={`/listing/tuition-private-classes/${listing.id}`} className="hover:underline">{listing.title}</a>
                      </h3>
                    {listing.isFeatured && (
                      <Badge className="bg-yellow-500">Featured</Badge>
                    )}
                  </div>

                  {/* Teacher/Seller Name - Prominent Display */}
                  {(listing.teacherName || listing.contactPerson) && (
                    <div className="flex items-center gap-2 mb-3 bg-green-50 dark:bg-green-950/20 p-2 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-green-700 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Teacher</p>
                        <p className="font-semibold text-sm text-green-700 dark:text-green-300">
                          {listing.teacherName || listing.contactPerson}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Class Details */}
                  <div className="space-y-2 mb-3">
                    {listing.classLevels && listing.classLevels.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {listing.classLevels.join(", ")}
                        </span>
                      </div>
                    )}

                    {listing.classMode && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground capitalize">
                          {listing.classMode} Classes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subjects */}
                  {listing.subjects && listing.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {listing.subjects.slice(0, 3).map((subject: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {subject}
                        </Badge>
                      ))}
                      {listing.subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{listing.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {listing.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.city}</span>
                      </div>
                    )}
                    {listing.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{listing.contactPhone}</span>
                      </div>
                    )}
                    {listing.viewCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{listing.viewCount} views</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/tuition-private-classes/${listing.id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}