import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., MacBook Pro M2 2023', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [
    { label: 'Laptop', value: 'laptop' },
    { label: 'Desktop', value: 'desktop' },
    { label: 'Tablet', value: 'tablet' },
    { label: 'Smartwatch', value: 'smartwatch' },
    { label: 'Camera', value: 'camera' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Audio', value: 'audio' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Apple, Dell, HP, Sony' },
  { name: 'model', label: 'Model', placeholder: 'e.g., MacBook Pro, XPS 15' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'New', value: 'new' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Excellent', value: 'excellent' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ]},
  { name: 'warranty', label: 'Warranty', placeholder: 'e.g., 6 months remaining' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your item, specifications, accessories included...', type: 'textarea' },
];

export default function ElectronicsForm() {
  return (
    <ListingForm
      title="Electronics & Gadgets"
      subtitle="Sell your gadgets"
      endpoint="electronics-gadgets"
      fields={FIELDS}
    />
  );
}
