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
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50${modeParam}${sourcesParam}`);
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
            <div className="text-gray-500">No results found for "{q}". Try different keywords.</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(data.results || {}).map(([group, items]: any) => {
                if (!items || items.length === 0) return null;
                return (
                  <div key={group}>
                    <h2 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">{group}</span>
                      <span className="text-gray-500 text-sm">({items.length} results)</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((it: any) => {
                        const image = it.raw?.images?.[0] || it.raw?.imageUrl || it.raw?.image || '';
                        const title = it.title || it.raw?.title || it.raw?.name || it.raw?.productName || it.raw?.institutionName || it.raw?.username || 'Untitled';
                        const description = it.snippet || (it.raw && summarizeRaw(it.raw));
                        const price = it.raw?.price || it.raw?.fee || it.raw?.rentAmount || '';
                        const location = it.raw?.location || it.raw?.city || it.raw?.address || '';
                        
                        return (
                          <Link key={it.id} href={getItemLink(group, it)} className="block">
                            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                              {image ? (
                                <div className="aspect-video bg-gray-100 overflow-hidden">
                                  <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                </div>
                              ) : (
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                  <span className="text-gray-400 text-4xl">📦</span>
                                </div>
                              )}
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{title}</h3>
                                {price && (
                                  <p className="text-lg font-bold text-primary mb-1">
                                    {typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : price}
                                  </p>
                                )}
                                {location && (
                                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                                    📍 {location}
                                  </p>
                                )}
                                {description && (
                                  <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
    'fashion-beauty': 'Fashion & Beauty Products',
    jewelry: 'Jewelry & Accessories',
    'jewelry-accessories': 'Jewelry & Accessories',
    sareeClothing: 'Saree & Clothing Shopping',
    'saree-clothing': 'Saree & Clothing Shopping',
    furniture: 'Furniture & Interior Decor',
    'furniture-interior-decor': 'Furniture & Interior Decor',
    electronics: 'Electronics & Gadgets',
    'electronics-gadgets': 'Electronics & Gadgets',
    phones: 'Phones, Tablets & Accessories',
    'phones-tablets': 'Phones, Tablets & Accessories',
    secondHandPhones: 'Second Hand Phones & Accessories',
    'second-hand-phones': 'Second Hand Phones & Accessories',
    computerRepair: 'Computer, Mobile & Laptop Repair Services',
    'computer-repair': 'Computer, Mobile & Laptop Repair Services',
    cyberCafe: 'Cyber Café / Internet Services',
    'cyber-cafe': 'Cyber Café / Internet Services',
    telecommunication: 'Telecommunication Services',
    serviceCentre: 'Service Centre / Warranty',
    'service-centre': 'Service Centre / Warranty',
    household: 'Household Services',
    'household-services': 'Household Services',
    eventDecoration: 'Event & Decoration Services',
    'event-decoration': 'Event & Decoration Services',
    healthWellness: 'Health & Wellness Services',
    'health-wellness': 'Health & Wellness Services',
    pharmacy: 'Pharmacy & Medical Stores',
    'pharmacy-medical': 'Pharmacy & Medical Stores',
    tuition: 'Tuition & Private Classes',
    languageClasses: 'Language Classes',
    'language-classes': 'Language Classes',
    dance: 'Dance, Karate, Gym & Yoga',
    'dance-gym-yoga': 'Dance, Karate, Gym & Yoga',
    academies: 'Academies - Music, Arts, Sports',
    skillTraining: 'Skill Training & Certification',
    'skill-training': 'Skill Training & Certification',
    schools: 'Schools, Colleges & Coaching',
    educationalConsultancy: 'Educational Consultancy & Study Abroad',
    'educational-consultancy': 'Educational Consultancy & Study Abroad',
    ebooks: 'E-Books & Online Courses',
    'ebooks-courses': 'E-Books & Online Courses',
    cricketTraining: 'Cricket & Sports Training',
    secondHandCars: 'Second Hand Cars & Bikes',
    'second-hand-cars-bikes': 'Second Hand Cars & Bikes',
    showrooms: 'Showrooms',
    carBikeRentals: 'Car & Bike Rentals',
    'car-bike-rentals': 'Car & Bike Rentals',
    vehicleLicense: 'Vehicle License Classes',
    'vehicle-license-classes': 'Vehicle License Classes',
    transportation: 'Transportation & Moving Services',
    'transportation-services': 'Transportation & Moving Services',
    constructionMaterials: 'Construction Materials',
    'construction-materials': 'Construction Materials',
    hostelPg: 'Hostel & PG',
    'hostel-listings': 'Hostel & PG',
    rentalListings: 'Rental Listings',
    rentals: 'Rental Listings',
    heavyEquipment: 'Heavy Equipment',
    'heavy-equipment': 'Heavy Equipment',
    industrialLand: 'Industrial Land',
    'industrial-land': 'Industrial Land',
    commercialProperties: 'Commercial Properties',
    'commercial-properties': 'Commercial Properties',
    officeSpaces: 'Office Spaces',
    'office-spaces': 'Office Spaces',
    propertyDeals: 'Property Deals',
    'property-deals': 'Property Deals',
    'cars-bikes': 'Cars & Bikes',
    cars: 'Cars & Bikes',
  };

  switch (group) {
    case 'properties':
    case 'property':
      return `/properties/${r.id}`;
    case 'rentals':
    case 'rentalListings':
    case 'rental-listings':
      return `/properties/rent/${r.id}`;
    case 'propertyDeals':
    case 'property-deals':
      return `/properties/deal/${r.id}`;
    case 'commercialProperties':
    case 'commercial-properties':
      return `/properties/commercial/${r.id}`;
    case 'officeSpaces':
    case 'office-spaces':
      return `/properties/office/${r.id}`;
    case 'industrialLand':
    case 'industrial-land':
      return `/properties/industrial/${r.id}`;
    case 'hostelPg':
    case 'hostel-listings':
    case 'hostel-pg':
      return `/hostel/${r.id}`;
    case 'cars':
    case 'cars-bikes':
      return `/vehicles/${r.id}`;
    case 'secondHandCars':
    case 'second-hand-cars-bikes':
      return `/vehicles/second-hand/${r.id}`;
    case 'carBikeRentals':
    case 'car-bike-rentals':
      return `/vehicles/rentals/${r.id}`;
    case 'heavyEquipment':
    case 'heavy-equipment':
      return `/equipment/${r.id}`;
    case 'showrooms':
      return `/showrooms/${r.id}`;
    case 'vehicleLicense':
    case 'vehicle-license-classes':
      return `/vehicle-license/${r.id}`;
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
