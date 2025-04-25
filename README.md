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

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication related pages
│   ├── dashboard/         # User dashboard
│   └── hospitals/         # Hospital booking interface
├── components/            # Reusable React components
├── lib/                   # Shared utilities and configurations
│   ├── prisma.ts         # Prisma client instance
│   └── validations/      # Zod schemas for validation
└── types/                # TypeScript type definitions
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
