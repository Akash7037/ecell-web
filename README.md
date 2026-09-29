# VSB E-Cell Website

The Entrepreneurship Cell website of VSB College of Engineering & Technical Campus.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: copy `.env.example` to `.env.local` and fill in values
4. Set up database: run the SQL in `lib/db/schema.sql`
5. Run migrations: `npx prisma migrate dev` (if using Prisma) or manual SQL
6. Start dev server: `npm run dev`

### Project Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - React components
- `lib/` - Database, auth, and utility libraries
- `data/` - Seed data and configuration
- `styles/` - Global styles and CSS
- `tests/` - Test files
- `public/` - Static assets

### Key Features
- Multi-page site with Next.js routing
- 3D animated logo with React Three Fiber
- GSAP scroll animations
- Framer Motion page transitions
- Admin portal with authentication
- Events management with countdown timers
- Responsive design with accessibility

### Build for Production
```bash
npm run build
npm start
```

## Admin Access
- Login: `/admin/login`
- Default credentials set in `.env.local`

## License
MIT
