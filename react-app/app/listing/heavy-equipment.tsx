import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Hydraulic Excavator for Sale', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [
    { label: 'Excavator', value: 'excavator' },
    { label: 'Bulldozer', value: 'bulldozer' },
    { label: 'Crane', value: 'crane' },
    { label: 'Loader', value: 'loader' },
    { label: 'Dumper', value: 'dumper' },
    { label: 'Compactor', value: 'compactor' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'brand', label: 'Brand', placeholder: 'e.g., CAT, Komatsu, Volvo' },
  { name: 'model', label: 'Model', placeholder: 'e.g., CAT 320D' },
  { name: 'year', label: 'Manufacturing Year', placeholder: 'e.g., 2018', type: 'number' },
  { name: 'condition', label: 'Condition', type: 'select', required: true, options: [
    { label: 'New', value: 'new' },
    { label: 'Excellent', value: 'excellent' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ]},
  { name: 'hoursUsed', label: 'Hours Used', placeholder: 'e.g., 5000 hours' },
  { name: 'price', label: 'Price (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe the equipment, working condition...', type: 'textarea' },
];

export default function HeavyEquipmentForm() {
  return (
    <ListingForm
      title="Heavy Equipment"
      subtitle="Sell construction equipment"
      endpoint="heavy-equipment"
      fields={FIELDS}
    />
  );
}
