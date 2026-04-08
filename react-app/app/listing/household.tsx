import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Professional Plumbing Services', required: true },
  { name: 'serviceType', label: 'Service Type', type: 'select', required: true, options: [
    { label: 'Plumbing', value: 'plumbing' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'Carpentry', value: 'carpentry' },
    { label: 'Painting', value: 'painting' },
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'AC Repair', value: 'ac_repair' },
    { label: 'Pest Control', value: 'pest_control' },
    { label: 'Other', value: 'other' },
  ]},
  { name: 'experience', label: 'Experience (years)', placeholder: 'e.g., 5', type: 'number' },
  { name: 'serviceArea', label: 'Service Area', placeholder: 'e.g., Kathmandu, Lalitpur' },
  { name: 'availability', label: 'Availability', type: 'select', options: [
    { label: '24/7', value: '24_7' },
    { label: 'Day Time Only', value: 'daytime' },
    { label: 'Weekends Only', value: 'weekends' },
    { label: 'By Appointment', value: 'appointment' },
  ]},
  { name: 'pricing', label: 'Pricing', placeholder: 'e.g., Starting from NPR 500' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number', required: true },
  { name: 'description', label: 'Description', placeholder: 'Describe your services, certifications, past work...', type: 'textarea' },
];

export default function ServicesForm() {
  return (
    <ListingForm
      title="Household Services"
      subtitle="Offer your services"
      endpoint="household-services"
      fields={FIELDS}
    />
  );
}
