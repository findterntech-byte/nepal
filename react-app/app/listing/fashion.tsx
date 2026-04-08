import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Designer Saree Collection', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [
    { label: 'Saree', value: 'saree' },
    { label: 'Kurti', value: 'kurti' },
    { label: 'Jewelry', value: 'jewelry' },
    { label: 'Handbag', value: 'handbag' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Watch', value: 'watch' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'brand', label: 'Brand', placeholder: 'e.g., BIBA, W, Pantaloons' },
  { name: 'size', label: 'Size', placeholder: 'e.g., S, M, L, XL' },
  { name: 'color', label: 'Color', placeholder: 'e.g., Red, Blue, Gold' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'New with Tags', value: 'new_with_tags' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ]},
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your item, fabric quality, occasion suitable...', type: 'textarea' },
];

export default function FashionForm() {
  return (
    <ListingForm
      title="Fashion & Beauty"
      subtitle="Sell your fashion items"
      endpoint="fashion-beauty-products"
      fields={FIELDS}
    />
  );
}
