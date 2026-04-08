import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Home Tutoring for Class 10', required: true },
  { name: 'subject', label: 'Subject/Topic', placeholder: 'e.g., Mathematics, Science, English' },
  { name: 'tuitionType', label: 'Tuition Type', type: 'select', required: true, options: [
    { label: 'Home Tuition', value: 'home' },
    { label: 'Online Tuition', value: 'online' },
    { label: 'Group Classes', value: 'group' },
    { label: 'Crash Course', value: 'crash_course' },
  ]},
  { name: 'level', label: 'Level', type: 'select', options: [
    { label: 'Primary (1-5)', value: 'primary' },
    { label: 'Secondary (6-10)', value: 'secondary' },
    { label: '+2/Intermediate', value: 'intermediate' },
    { label: 'Bachelor', value: 'bachelor' },
    { label: 'Competitive Exams', value: 'competitive' },
  ]},
  { name: 'experience', label: 'Experience (years)', placeholder: 'e.g., 3', type: 'number' },
  { name: 'fee', label: 'Fee per Session (NPR)', placeholder: 'e.g., 500', type: 'price' },
  { name: 'availability', label: 'Availability', placeholder: 'e.g., Evening 4-8 PM' },
  { name: 'location', label: 'Location/Area', placeholder: 'e.g., Baneshwor, Kirtipur' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your qualifications, teaching methodology...', type: 'textarea' },
];

export default function TuitionForm() {
  return (
    <ListingForm
      title="Tuition & Classes"
      subtitle="Offer tutoring services"
      endpoint="tuition-classes"
      fields={FIELDS}
    />
  );
}
