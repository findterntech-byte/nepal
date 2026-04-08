import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., iPhone 14 Pro Max 256GB', required: true },
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Apple, Samsung, Xiaomi', required: true },
  { name: 'model', label: 'Model', placeholder: 'e.g., iPhone 14, Galaxy S23' },
  { name: 'storageCapacity', label: 'Storage', placeholder: 'e.g., 128GB, 256GB', required: true },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'Brand New', value: 'brand_new' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Excellent', value: 'excellent' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ]},
  { name: 'color', label: 'Color', placeholder: 'e.g., Black, Gold, Blue' },
  { name: 'imei', label: 'IMEI (optional)', placeholder: 'Phone IMEI number' },
  { name: 'batteryHealth', label: 'Battery Health %', placeholder: 'e.g., 85', type: 'number' },
  { name: 'accessories', label: 'Accessories Included', type: 'select', options: [
    { label: 'Box & Charger', value: 'box_charger' },
    { label: 'Charger Only', value: 'charger' },
    { label: 'None', value: 'none' },
  ]},
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your phone, any issues, reason for selling...', type: 'textarea' },
];

export default function SecondPhonesForm() {
  return (
    <ListingForm
      title="Second Hand Phones"
      subtitle="Sell your used phone"
      endpoint="second-hand-phones"
      fields={FIELDS}
    />
  );
}
