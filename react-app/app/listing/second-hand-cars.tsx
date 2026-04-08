import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Toyota Corolla 2020', required: true },
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Toyota, Honda, Suzuki', required: true },
  { name: 'model', label: 'Model', placeholder: 'e.g., Corolla, Civic, Swift' },
  { name: 'year', label: 'Year', placeholder: 'e.g., 2020', type: 'number' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'Excellent', value: 'excellent' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
    { label: 'Poor', value: 'poor' },
  ]},
  { name: 'fuelType', label: 'Fuel Type', type: 'select', options: [
    { label: 'Petrol', value: 'petrol' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Electric', value: 'electric' },
    { label: 'Hybrid', value: 'hybrid' },
  ]},
  { name: 'transmission', label: 'Transmission', type: 'select', options: [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
  ]},
  { name: 'mileage', label: 'Mileage (km)', placeholder: 'e.g., 45000', type: 'number' },
  { name: 'color', label: 'Color', placeholder: 'e.g., White, Silver, Black' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your vehicle, any repairs done, reason for selling...', type: 'textarea' },
];

export default function SecondHandCarsForm() {
  return (
    <ListingForm
      title="Second Hand Cars & Bikes"
      subtitle="Sell your used vehicle"
      endpoint="second-hand-cars-bikes"
      fields={FIELDS}
    />
  );
}
