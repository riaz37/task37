# Project Architecture and Technical Decisions

## Tech Stack Overview

### Frontend
- **Next.js 15.3.1** (App Router)
  - Chosen for its server-side rendering capabilities, built-in API routes, and file-based routing
  - App Router provides better performance and more intuitive routing compared to Pages Router
  - Built-in TypeScript support and optimized build system

### Backend
- **Next.js API Routes**
  - Unified frontend and backend deployment
  - Reduces complexity of managing separate services
  - Built-in API route handlers with improved performance

### API Documentation
- **Swagger/OpenAPI**
  - Interactive API documentation using `next-swagger-doc` and `swagger-ui-react`
  - Auto-generated documentation from JSDoc comments
  - Available at `/api-docs` endpoint
  - Supports testing API endpoints directly from the UI

### Database
- **PostgreSQL 16**
  - Robust relational database with excellent support for complex queries
  - Strong data integrity through ACID compliance
  - Excellent performance for read-heavy operations common in booking systems

### ORM
- **Prisma 6.6.0**
  - Type-safe database queries
  - Automatic migrations and schema management
  - Excellent TypeScript integration
  - Built-in connection pooling

### Authentication
- **NextAuth.js 5.0**
  - Built specifically for Next.js
  - JWT-based authentication
  - Session management handled automatically

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (main)/            # Main layout group
│   │   ├── layout.tsx     # Root layout with SessionProvider
│   │   └── page.tsx       # Home page
│   ├── (swagger)/         # Swagger documentation group
│   │   ├── api-docs/      # API documentation pages
│   │   │   ├── layout.tsx # Swagger UI layout
│   │   │   └── page.tsx   # Swagger UI page
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── register/  # User registration
│   │   │   └── [...]/     # Other auth endpoints
│   │   └── docs/          # Swagger documentation endpoint
├── components/            # Reusable React components
├── lib/                   # Shared utilities and configurations
│   ├── prisma.ts         # Prisma client instance
│   ├── swagger.ts        # Swagger configuration
│   └── validations/      # Zod schemas for validation
├── middleware.ts         # Next.js middleware (auth protection)
└── types/               # TypeScript type definitions
    └── swagger.d.ts     # Swagger type definitions

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seeding script

public/                 # Static assets
└── medical-logo.svg    # Site logo

config/
└── next.config.ts      # Next.js configuration
```

## Database Schema

### Key Entities
- `Hospital`: Medical facilities offering services
- `Service`: Medical services offered by hospitals
- `Booking`: Appointment bookings linking users and services
- `User`: System users (patients)

## API Structure

### Documentation
- Interactive API documentation available at `/api-docs`
- Swagger UI provides:
  - Endpoint descriptions and parameters
  - Request/response schemas
  - Authentication requirements
  - Interactive testing interface

### Authentication Endpoints
- `POST /api/auth/signin`: User login
- `POST /api/auth/signup`: User registration

### Booking Endpoints
- `GET /api/bookings`: List user's bookings
- `POST /api/bookings`: Create new booking

### Hospital Endpoints
- `GET /api/hospitals`: List available hospitals
- `GET /api/hospitals/:id/services`: Get hospital services
- `GET /api/hospitals/:id/services/:serviceId/time-slots`: Get available time slots

## Key Design Decisions

### 1. Monolithic Architecture
- **Reason**: 
  - Faster development and simpler deployment
  - Easier to maintain for small to medium scale
  - Lower operational complexity

### 2. Data Validation
- Using Zod for runtime type checking
- Validation occurs at API boundaries
- Consistent error handling across the application

### 3. Authentication Strategy
- JWT-based authentication
- Session handling via HTTP-only cookies

## Development Practices

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- TypeScript for type safety

## Deployment
- Next.js provides optimized production builds
- Vercel for hosting and deployment
- Environment variables managed via `.env` files

### Docker Configuration
- PostgreSQL runs in Docker container
- Environment variables managed via docker-compose
- Volume mounting for data persistence

### Development Setup
```bash
# Install dependencies
npm install

# Start database
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

## Security Measures

1. **API Security**
   - Input validation
   - SQL injection prevention via Prisma

2. **Authentication**
   - Password hashing with bcrypt
   - Protected API routes

3. **Data Protection**
   - Environment variable protection
