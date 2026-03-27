import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

function useQueryParam(name: string) {
  const [location] = useLocation();
  const [, search] = location.split('?');
  const params = new URLSearchParams(search || '');
  return params.get(name) || '';
}

export default function SearchPage() {
  const q = useQueryParam('q');
  const mode = useQueryParam('mode');
  const sources = useQueryParam('sources');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['global-search', q],
    queryFn: async () => {
      if (!q || q.length < 2) return { q, results: {} };
      const modeParam = mode && (mode === 'all' || mode === 'and') ? '&mode=all' : '';
      const sourcesParam = sources ? `&sources=${encodeURIComponent(sources)}` : '';
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8${modeParam}${sourcesParam}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: !!q && q.length >= 2,
    placeholderData: (prev) => prev,
  });

  const { data: searchSources } = useQuery({
    queryKey: ['search-sources'],
    queryFn: async () => {
      const res = await fetch('/api/search/sources');
      if (!res.ok) return { sources: [] };
      return res.json();
    },
    enabled: true,
  });

  const totalResultsCount = data ? Object.values(data.results || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Search results for "{q}"</h1>

      {q && (
        <div className="mb-4 text-sm text-gray-600">You searched: "{q}"</div>
      )}

      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-red-600">Error loading results.</div>}

      {data && (
        <>
          {totalResultsCount === 0 ? (
            <div className="text-gray-500">Not found</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(data.results || {}).map(([group, items]: any) => (
                <div key={group}>
                  <h2 className="text-lg font-medium mb-2">{group} ({items.length})</h2>
                  {items.length === 0 ? (
                    <div className="text-sm text-gray-500">No results</div>
                  ) : (
                    <ul className="space-y-2">
                      {items.map((it: any) => (
                        <li key={it.id} className="p-3 border rounded hover:shadow">
                          <Link href={getItemLink(group, it)} className="block">
                            <div className="font-semibold text-primary-foreground">{it.title || it.raw?.title || it.raw?.name || it.raw?.username || 'Untitled'}</div>
                            <div className="text-sm text-gray-600 mt-1">{it.snippet || (it.raw && summarizeRaw(it.raw))}</div>
                            {it.matchedWords && it.matchedWords.length > 0 && (
                              <div className="text-sm text-accent mt-1">Matched: {Array.from(new Set(it.matchedWords)).join(', ')}</div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!q && <div className="text-gray-500">Type at least 2 characters to search across the site.</div>}
    </div>
  );
}

function getItemLink(group: string, item: any) {
  const r = item?.raw || item;
  if (!r) return '#';

  const buildCategoryItemHref = (categoryLabel: string, id: string) => `/${encodeURIComponent(categoryLabel)}/${id}`;

  const groupToCategoryLabel: Record<string, string> = {
    fashion: 'Fashion & Beauty Products',
    jewelry: 'Jewelry & Accessories',
    sareeClothing: 'Saree & Clothing Shopping',
    furniture: 'Furniture & Interior Decor',
    electronics: 'Electronics & Gadgets',
    phones: 'Phones, Tablets & Accessories',
    secondHandPhones: 'Second Hand Phones & Accessories',
    computerRepair: 'Computer, Mobile & Laptop Repair Services',
    cyberCafe: 'Cyber Café / Internet Services',
    telecommunication: 'Telecommunication Services',
    serviceCentre: 'Service Centre / Warranty',
    household: 'Household Services',
    eventDecoration: 'Event & Decoration Services',
    healthWellness: 'Health & Wellness Services',
    pharmacy: 'Pharmacy & Medical Stores',
    tuition: 'Tuition & Private Classes',
    languageClasses: 'Language Classes',
    dance: 'Dance, Karate, Gym & Yoga',
    academies: 'Academies - Music, Arts, Sports',
    skillTraining: 'Skill Training & Certification',
    schools: 'Schools, Colleges & Coaching',
    educationalConsultancy: 'Educational Consultancy & Study Abroad',
    ebooks: 'E-Books & Online Courses',
    cricketTraining: 'Cricket & Sports Training',
    secondHandCars: 'Second Hand Cars & Bikes',
    showrooms: 'Showrooms',
    carBikeRentals: 'Car & Bike Rentals',
    vehicleLicense: 'Vehicle License Classes',
    transportation: 'Transportation & Moving Services',
    constructionMaterials: 'Construction Materials',
    hostelPg: 'Hostel & PG',
    rentalListings: 'Rental Listings',
  };

  switch (group) {
    case 'properties':
      return `/properties/${r.id}`;
    case 'rentals':
      return `/properties/rent/${r.id}`;
    case 'propertyDeals':
      return `/properties/deal/${r.id}`;
    case 'commercialProperties':
      return `/properties/commercial/${r.id}`;
    case 'officeSpaces':
      return `/properties/office/${r.id}`;
    case 'cars':
      return `/vehicles/${r.id}`;
    case 'blogPosts':
      return `/blog/${r.slug || r.id}`;
    case 'articles':
      return `/articles/${r.id}`;
    case 'categories':
      return `/category/${r.slug || r.id}`;
    case 'subcategories':
      return `/subcategory/${r.slug || r.id}`;
    case 'users':
      return `/profile/${r.id}`;
    default:
      if (r.id) {
        const label = groupToCategoryLabel[group] || r.category || r.categoryName || r.subcategory || r.subcategoryName || group;
        return buildCategoryItemHref(label, r.id);
      }
      return '#';
  }
}

function summarizeRaw(raw: any) {
  try {
    if (raw.description) return (raw.description || '').slice(0, 140);
    if (raw.address) return (raw.address || '').slice(0, 140);
    if (raw.summary) return (raw.summary || '').slice(0, 140);
    return JSON.stringify(raw).slice(0, 140);
  } catch (e) {
    return '';
  }
}
