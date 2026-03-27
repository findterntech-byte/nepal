# Overview

This is a full-stack real estate platform called "Qatar Living" built with modern web technologies. The application serves as a comprehensive property listing and management system where users can browse, search, and filter properties across Qatar. The platform features property categories (residential, commercial, international), location-based filtering, agency management, and FAQ sections to help users navigate the real estate market.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with Shadcn/ui component library for consistent design
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured endpoints for properties, agencies, locations, and categories
- **Development**: Hot module replacement and middleware for request logging

## Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon serverless platform
- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Schema Design**: Normalized database with tables for users, agencies, locations, property categories, properties, and FAQs
- **Migrations**: Drizzle Kit for database schema management

## Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **User System**: Basic user authentication with username/password

## External Dependencies
- **Database Hosting**: Neon serverless PostgreSQL
- **Image Hosting**: External image URLs (Unsplash, Pixabay)
- **Font Services**: Google Fonts for typography
- **Development Tools**: Replit-specific plugins for development environment integration
- **UI Components**: Radix UI primitives for accessible component foundation