import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., 3 Bedroom Apartment in Thamel', required: true },
  { name: 'propertyType', label: 'Property Type', type: 'select', required: true, options: [
    { label: 'House', value: 'house' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'Land', value: 'land' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Office', value: 'office' },
  ]},
  { name: 'listingType', label: 'Listing Type', type: 'select', required: true, options: [
    { label: 'For Sale', value: 'sale' },
    { label: 'For Rent', value: 'rent' },
    { label: 'Lease', value: 'lease' },
  ]},
  { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
  { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
  { name: 'area', label: 'Area (sq ft)', placeholder: 'e.g., 1500', type: 'number' },
  { name: 'floors', label: 'Floors', type: 'number' },
  { name: 'furnished', label: 'Furnished', type: 'select', options: [
    { label: 'Fully Furnished', value: 'full' },
    { label: 'Semi Furnished', value: 'semi' },
    { label: 'Unfurnished', value: 'none' },
  ]},
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'priceNegotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Thamel, Lazimpat, Baneshwor', required: true },
  { name: 'city', label: 'City', placeholder: 'e.g., Kathmandu, Pokhara, Lalitpur' },
  { name: 'roadAccess', label: 'Road Access', placeholder: 'e.g., 15 ft pitched road' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your property, nearby amenities, features...', type: 'textarea' },
];

export default function RealEstateForm() {
  return (
    <ListingForm
      title="Real Estate"
      subtitle="Sell or rent your property"
      endpoint="properties"
      fields={FIELDS}
    />
  );
}
