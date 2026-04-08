import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Wooden Sofa Set', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [
    { label: 'Sofa', value: 'sofa' },
    { label: 'Bed', value: 'bed' },
    { label: 'Table', value: 'table' },
    { label: 'Chair', value: 'chair' },
    { label: 'Wardrobe', value: 'wardrobe' },
    { label: 'Decor', value: 'decor' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'material', label: 'Material', placeholder: 'e.g., Teak Wood, Metal, Fabric' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'New', value: 'new' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ]},
  { name: 'color', label: 'Color', placeholder: 'e.g., Brown, White, Black' },
  { name: 'dimensions', label: 'Dimensions', placeholder: 'e.g., 6ft x 3ft x 2ft' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your furniture item...', type: 'textarea' },
];

export default function FurnitureForm() {
  return (
    <ListingForm
      title="Furniture & Decor"
      subtitle="Sell your furniture"
      endpoint="furniture-interior-decor"
      fields={FIELDS}
    />
  );
}
