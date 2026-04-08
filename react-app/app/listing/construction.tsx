import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Brick for Construction', required: true },
  { name: 'materialType', label: 'Material Type', type: 'select', required: true, options: [
    { label: 'Bricks', value: 'bricks' },
    { label: 'Cement', value: 'cement' },
    { label: 'Steel', value: 'steel' },
    { label: 'Sand', value: 'sand' },
    { label: 'Aggregate', value: 'aggregate' },
    { label: 'Tiles', value: 'tiles' },
    { label: 'Plywood', value: 'plywood' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Ambuja, ACC, TATA' },
  { name: 'quantity', label: 'Quantity', placeholder: 'e.g., 1000 pieces' },
  { name: 'unit', label: 'Unit', placeholder: 'e.g., pieces, tons, bags' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'negotiable', label: 'Price Negotiable', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'deliveryAvailable', label: 'Delivery Available', type: 'select', options: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]},
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Bhaktapur' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe the materials, quality, delivery terms...', type: 'textarea' },
];

export default function ConstructionForm() {
  return (
    <ListingForm
      title="Construction Materials"
      subtitle="Sell building materials"
      endpoint="construction-materials"
      fields={FIELDS}
    />
  );
}
