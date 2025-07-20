# Health Meter CRM Accounting Module

A comprehensive Customer Relationship Management (CRM) system with an integrated accounting module designed for healthcare organizations. This application helps manage corporate clients, diagnostic centers, invoicing, eligibility rules, and financial operations.

## Features

### Core Modules

- **Accounting Dashboard**: Overview of financial metrics and key performance indicators
- **Master Data Management**: Centralized management of corporate clients, diagnostic centers, locations, and services
- **Invoice Management**: Create, view, and manage invoices with pro-forma invoice generation
- **DC Bills**: Diagnostic Center billing management with activity tracking
- **Receivables**: Track and manage outstanding payments and revenue
- **Eligibility Management**: Configure and manage corporate eligibility rules and benefit groups

### Key Functionality

- Real-time data synchronization
- Activity logging and audit trails
- CSV export capabilities
- Advanced search and filtering
- Role-based access control
- Responsive design for desktop and mobile

## Technology Stack

### Frontend
- **React** (v18.3.1) - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Lucide React** - Icon library
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - ORM for database management
- **SQLite** - Database (development)
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HM_CRM_Proto
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
```

### 3. Database Setup

```bash
# From the server directory
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed initial data (optional)
```

### 4. Environment Configuration

Create a `.env` file in the server directory:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3001
```

## Running the Application

### Development Mode

You need to run both the frontend and backend servers:

#### Start Backend Server
```bash
cd server
npm run build    # Build TypeScript files
npm start        # Start the server
# OR
npm run dev      # Start with hot-reload (requires ts-node)
```

The backend server will run on `http://localhost:3001`

#### Start Frontend Server
```bash
# From the root directory
npm run dev
```

The frontend will run on `http://localhost:8080`

### Production Build

#### Build Frontend
```bash
npm run build
```

#### Build Backend
```bash
cd server
npm run build
```

## Project Structure

```
HM_CRM_Proto/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   └── lib/               # Utility functions
├── server/                # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema and migrations
│   └── dist/              # Compiled JavaScript
├── public/                # Static assets
├── specs/                 # Project specifications
└── screenshots/           # Application screenshots
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Corporates
- `GET /api/corporates` - List all corporates
- `GET /api/corporates/:id` - Get specific corporate
- `POST /api/corporates` - Create new corporate
- `PUT /api/corporates/:id` - Update corporate
- `DELETE /api/corporates/:id` - Delete corporate

### Diagnostic Centers
- `GET /api/diagnostic-centers` - List all diagnostic centers
- `GET /api/diagnostic-centers/:id` - Get specific center
- `POST /api/diagnostic-centers` - Create new center
- `PUT /api/diagnostic-centers/:id` - Update center
- `DELETE /api/diagnostic-centers/:id` - Delete center

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get specific invoice
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### DC Bills
- `GET /api/dc-bills` - List all DC bills
- `GET /api/dc-bills/:id` - Get specific bill
- `POST /api/dc-bills` - Create new bill
- `PUT /api/dc-bills/:id` - Update bill
- `DELETE /api/dc-bills/:id` - Delete bill

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev` - Start with nodemon (hot-reload)
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Port already in use**: Make sure no other services are running on ports 3001 (backend) or 8080 (frontend)
2. **Database connection errors**: Ensure the database file exists and has proper permissions
3. **Module not found errors**: Run `npm install` in both root and server directories
4. **TypeScript errors**: Run `npm run build` in the server directory before starting

### Development Tips

- Use the browser developer tools to inspect API calls
- Check the server logs for backend errors
- The SQLite database file is located at `server/prisma/dev.db`
- You can use Prisma Studio to inspect the database: `cd server && npx prisma studio`

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team.
