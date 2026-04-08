import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Honda Civic 2022', required: true },
  { name: 'type', label: 'Vehicle Type', type: 'select', required: true, options: [
    { label: 'Car', value: 'car' },
    { label: 'Bike', value: 'bike' },
    { label: 'Scooter', value: 'scooter' },
    { label: 'Truck', value: 'truck' },
    { label: 'Bus', value: 'bus' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Honda, Yamaha, Toyota', required: true },
  { name: 'model', label: 'Model', placeholder: 'e.g., Civic, FZ, Fortuner' },
  { name: 'year', label: 'Year', placeholder: 'e.g., 2022', type: 'number' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'New', value: 'new' },
    { label: 'Like New', value: 'like_new' },
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
    { label: 'CNG', value: 'cng' },
  ]},
  { name: 'transmission', label: 'Transmission', type: 'select', options: [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
  ]},
  { name: 'mileage', label: 'Mileage (km)', placeholder: 'e.g., 15000', type: 'number' },
  { name: 'color', label: 'Color', placeholder: 'e.g., White, Black, Silver' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your vehicle, features, reason for selling...', type: 'textarea' },
];

export default function CarsBikesForm() {
  return (
    <ListingForm
      title="Cars & Bikes"
      subtitle="Sell your vehicle"
      endpoint="cars-bikes"
      fields={FIELDS}
    />
  );
}
