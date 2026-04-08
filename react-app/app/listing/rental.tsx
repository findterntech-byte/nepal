import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., 2 BHK Apartment for Rent', required: true },
  { name: 'propertyType', label: 'Property Type', type: 'select', required: true, options: [
    { label: 'Room', value: 'room' },
    { label: 'Flat/Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Studio', value: 'studio' },
    { label: 'PG/Hostel', value: 'pg' },
  ]},
  { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
  { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
  { name: 'area', label: 'Area (sq ft)', placeholder: 'e.g., 800', type: 'number' },
  { name: 'floor', label: 'Floor', placeholder: 'e.g., 3rd floor' },
  { name: 'furnished', label: 'Furnished', type: 'select', options: [
    { label: 'Fully Furnished', value: 'full' },
    { label: 'Semi Furnished', value: 'semi' },
    { label: 'Unfurnished', value: 'none' },
  ]},
  { name: 'monthlyRent', label: 'Monthly Rent (NPR)', placeholder: 'Enter rent amount', type: 'price', required: true },
  { name: 'securityDeposit', label: 'Security Deposit (NPR)', placeholder: 'e.g., 2 months rent', type: 'price' },
  { name: 'availableFrom', label: 'Available From', placeholder: 'e.g., Immediate, 1st May' },
  { name: 'location', label: 'Location', placeholder: 'e.g., Baneshwor, Putalisadak', required: true },
  { name: 'city', label: 'City', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe the property, amenities nearby...', type: 'textarea' },
];

export default function RentalForm() {
  return (
    <ListingForm
      title="Rental Listings"
      subtitle="Rent out your property"
      endpoint="rental-listings"
      fields={FIELDS}
    />
  );
}
