# MedBook - Healthcare Booking System

A Next.js application for booking medical appointments, built with TypeScript and Prisma.

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose
- npm or yarn
- PostgreSQL 16 (via Docker)

## Tech Stack

- **Frontend:** Next.js 15.3.1 (App Router)
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6.6.0
- **Authentication:** NextAuth.js 5.0
- **API Documentation:** Swagger/OpenAPI
- **Styling:** TailwindCSS 4.x

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medbook
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospital_booking"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Installation and Setup

```bash
# Install dependencies
npm install

# Start the database
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the development server
npm run dev
```

The application will be available at http://localhost:3000

## Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting. Configuration files are included in the repository.

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Git Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit using conventional commits:
```bash
git commit -m "feat: add booking confirmation"
git commit -m "fix: resolve date picker issue"
```

3. Push and create a pull request:
```bash
git push origin feature/your-feature-name
```

### API Documentation

The API documentation is available at http://localhost:3000/api-docs when running in development mode. It provides:

- Interactive API testing interface
- Detailed request/response schemas
- Authentication requirements
- Example requests and responses

To update the API documentation:

1. Add JSDoc comments to your API routes:
```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Your endpoint description
 *     ...
 */
```

2. Update schema definitions in `src/lib/swagger.ts` if needed
3. Restart the development server to see changes

### API Endpoints

#### Authentication
- `POST /api/auth/signin`: User login
- `POST /api/auth/signup`: User registration

#### Bookings
- `GET /api/bookings`: List user's bookings
- `POST /api/bookings`: Create new booking

#### Hospitals
- `GET /api/hospitals`: List available hospitals
- `GET /api/hospitals/:id/services`: Get hospital services

### Project Structure

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

### Database Schema

Key entities and their relationships:
- `Hospital`: Medical facilities
- `Service`: Medical services offered by hospitals
- `Booking`: Appointment bookings
- `User`: System users (patients)


## Demo Account

For testing purposes, use:
- Email: demo@example.com
- Password: password123

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up -d
```

## Common Issues

1. **Database Connection Issues**
   - Ensure Docker is running
   - Check if PostgreSQL container is healthy
   - Verify DATABASE_URL in .env

2. **Authentication Errors**
   - Confirm NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your development URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
