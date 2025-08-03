# Replit Portfolio Development Guide

## Overview

This is a professional portfolio website for Aniket Dattaram Desai, built as a full-stack application using React, Express, and TypeScript. The project features a modern design with animations, GitHub integration, and admin functionality for content management. It showcases projects, skills, blog posts, and provides contact functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM - Now fully integrated with database storage
- **Session Management**: Database-persistent storage using PostgreSQL
- **File Uploads**: Multer for handling media uploads
- **API Design**: RESTful endpoints with proper error handling
- **Storage**: Migrated from in-memory to DatabaseStorage implementation

### Component Structure
- **UI Components**: shadcn/ui component library for consistent design
- **Layout Components**: Reusable navigation and footer components
- **Page Components**: Individual pages (Home, About, Projects, Blog, Contact)
- **Feature Components**: Specialized components (ProjectCard, ProjectModal, AdminModal)

## Key Components

### Database Schema
- **Users**: Basic authentication with username/password
- **Projects**: GitHub integration with custom metadata (images, descriptions)
- **Contact Messages**: Form submissions storage

### GitHub Integration
- **Auto-sync**: Fetches repositories from GitHub user "hari3100"
- **Project Categorization**: Automatic categorization based on language and keywords  
- **Real-time Updates**: Projects update automatically when new repos are created
- **Automatic Showcase Images**: Fetches showcase images (showcaseimage.jpg/png/jpeg, showcase.jpg/png/jpeg) from repos automatically when projects are added
- **Image Management**: Admin can refresh showcase images for existing projects with bulk update functionality

### Admin Functionality
- **Protected Routes**: Admin authentication for content management
- **Media Uploads**: Image and video upload capability for projects
- **Project Enhancement**: Custom descriptions and featured project selection
- **Showcase Image Auto-Fetch**: Automatically detects and fetches showcase images from GitHub repositories when adding projects
- **Bulk Image Refresh**: Admin interface to refresh showcase images for all existing projects

### Theme System
- **Dark/Light Mode**: Persistent theme switching with system preference detection
- **CSS Variables**: Comprehensive color system for consistent theming

## Data Flow

1. **GitHub Data**: API proxy fetches repositories to avoid CORS issues
2. **Project Enhancement**: Admin can add custom media and descriptions
3. **Contact Form**: Submissions stored in database with validation
4. **Theme Persistence**: User preferences saved to localStorage
5. **Admin Authentication**: Simple token-based authentication for content management

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon DB
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **multer**: File upload handling
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **vite**: Build tool and dev server
- **drizzle-kit**: Database migrations and schema management
- **esbuild**: Production build bundling

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle handles schema migrations

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)
- **File Storage**: Local uploads directory for media files

### Production Setup
- Server serves static files and API endpoints
- Database schema automatically applied via Drizzle
- File uploads stored in server filesystem
- Admin authentication via environment-configurable password

### Development Workflow
- Hot reload enabled via Vite integration
- TypeScript compilation checking
- Database schema synchronization with `db:push` command
- Replit-specific development tools integrated

The application is designed to be fully responsive, accessible, and performant, with a focus on showcasing technical skills through both the content and the implementation itself.