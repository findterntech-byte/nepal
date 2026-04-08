import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., MacBook Pro M2 2023', required: true },
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Apple, Samsung, Xiaomi', required: true },
  { name: 'model', label: 'Model', placeholder: 'e.g., iPhone 14, Galaxy S23' },
  { name: 'storageCapacity', label: 'Storage', placeholder: 'e.g., 128GB, 256GB' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'Brand New', value: 'brand_new' },
    { label: 'Unboxed', value: 'unboxed' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Excellent', value: 'excellent' },
  ]},
  { name: 'color', label: 'Color', placeholder: 'e.g., Black, Gold, Blue' },
  { name: 'warranty', label: 'Warranty', placeholder: 'e.g., 6 months remaining' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your phone...', type: 'textarea' },
];

export default function PhonesForm() {
  return (
    <ListingForm
      title="Phones & Tablets"
      subtitle="Sell phones and tablets"
      endpoint="phones-tablets-accessories"
      fields={FIELDS}
    />
  );
}
