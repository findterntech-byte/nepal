import React from 'react';
import { ListingForm, FormField } from '@/components/ListingForm';

const FIELDS: FormField[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g., Maruti Swift for Rent', required: true },
  { name: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true, options: [
    { label: 'Car', value: 'car' },
    { label: 'Bike', value: 'bike' },
    { label: 'Scooter', value: 'scooter' },
    { label: 'Van', value: 'van' },
    { label: 'Bus', value: 'bus' },
  ]},
  { name: 'brand', label: 'Brand', placeholder: 'e.g., Maruti, Honda, Yamaha' },
  { name: 'model', label: 'Model', placeholder: 'e.g., Swift, Activa' },
  { name: 'year', label: 'Year', placeholder: 'e.g., 2022', type: 'number' },
  { name: 'fuelType', label: 'Fuel Type', type: 'select', options: [
    { label: 'Petrol', value: 'petrol' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Electric', value: 'electric' },
  ]},
  { name: 'seats', label: 'Number of Seats', type: 'number' },
  { name: 'driverAvailable', label: 'Driver Available', type: 'select', options: [
    { label: 'Yes with Driver', value: 'yes_with_driver' },
    { label: 'Self Drive Only', value: 'self_drive' },
    { label: 'Both Options', value: 'both' },
  ]},
  { name: 'pricePerDay', label: 'Price per Day (NPR)', placeholder: 'Enter price', type: 'price', required: true },
  { name: 'location', label: 'Location', placeholder: 'e.g., Kathmandu, Pokhara', required: true },
  { name: 'phone', label: 'Phone Number', placeholder: 'Your contact number' },
  { name: 'description', label: 'Description', placeholder: 'Describe your rental service, terms...', type: 'textarea' },
];

export default function CarRentalsForm() {
  return (
    <ListingForm
      title="Car & Bike Rentals"
      subtitle="Offer rental services"
      endpoint="car-bike-rentals"
      fields={FIELDS}
    />
  );
}
