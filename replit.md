# Overview

CashPropertyBuyers.uk is a property buying service application that allows homeowners to quickly get cash offers for their properties. The platform provides instant property valuations, sends offers via multiple channels (email, SMS, WhatsApp), and manages the complete property purchase process. The application features a React frontend with a Node.js/Express backend, PostgreSQL database, and integrations with UK property data services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state and forms with React Hook Form
- **Routing**: Wouter for client-side routing
- **Authentication**: Context-based authentication with protected routes
- **Design System**: Custom theme with Inter and Roboto fonts, consistent color scheme using CSS variables

## Backend Architecture
- **Framework**: Express.js with TypeScript for API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL session store with connect-pg-simple
- **API Design**: RESTful endpoints with comprehensive error handling and request logging

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon Database serverless hosting
- **Schema Management**: Drizzle migrations with schema definitions
- **Core Tables**: Users, properties, contacts, valuations, ownerships, chat messages
- **Relationships**: Foreign key relationships between users and their property interactions

## Authentication and Authorization
- **Strategy**: Session-based authentication using Passport.js local strategy
- **Password Security**: Scrypt-based password hashing with salt
- **Session Management**: Express sessions stored in PostgreSQL
- **Route Protection**: Middleware-based authentication checks for protected endpoints

## External Dependencies

### Property Data Services
- **Postcodes.io API**: Free UK postcode validation and address lookup
- **UK Land Registry**: Property price data integration for market valuations
- **OpenAI GPT-4**: AI-powered address generation and chat functionality

### Communication Services
- **Twilio**: SMS and WhatsApp Business API integration for customer notifications
- **SMTP Email**: Nodemailer with configurable SMTP providers for email delivery
- **SendGrid**: Secondary email service integration for reliable delivery

### Infrastructure Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Hosting**: Development and deployment platform integration
- **Vite Development**: Hot module replacement and optimized build pipeline

### Business Logic Integrations
- **Property Valuation**: Automated market value estimation using multiple data sources
- **Offer Calculation**: Algorithmic pricing based on property type, condition, and market data
- **Multi-channel Notifications**: Coordinated messaging across email, SMS, and WhatsApp platforms