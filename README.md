# 1ndex

A modern, elegant file indexing and management system built with Next.js. 1ndex provides a clean interface for browsing, organizing, and managing files and folders with both public viewing and administrative capabilities.

## Features

- 📁 **Hierarchical Folder Structure** - Organize files in nested folders
- 🔍 **File Browsing** - Browse files and folders with an intuitive interface
- 👨‍💼 **Admin Panel** - Full CRUD operations for files and folders
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔐 **Authentication** - Secure admin access with NextAuth
- 📊 **Dual View Modes** - Switch between grid and list views
- 🎯 **Breadcrumb Navigation** - Easy navigation through folder hierarchy

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

## Installation

1. Clone the repository:
```bash
git clone https://github.com/0xaadesh/1ndex
cd 1ndex
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/1ndex"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_PASSWORD="your-admin-password"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
# or for migrations
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
1ndex/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes
│   ├── f/                 # Public folder routes
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── admin/             # Admin-specific components
│   ├── files/             # File browser components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions
├── prisma/                 # Prisma schema and migrations
└── public/                 # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Usage

### Public View

Visit the home page to browse files and folders. Users can:
- Navigate through folder hierarchies
- View files in grid or list mode
- Download files
- Use breadcrumb navigation

### Admin Panel

Access the admin panel at `/admin/login` with your admin password. Admins can:
- Create, edit, and delete folders
- Upload and manage files
- Organize content in a hierarchical structure
- Switch between grid and list views
- Access theme settings

## Database Schema

The application uses two main models:

- **Folder**: Represents a folder with hierarchical relationships
- **File**: Represents a file with a download URL and optional folder association

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Credits

Made with ❤️ by Aadesh | [aadesh.me](https://aadesh.me)

---

**1ndex** - Your modern file indexing solution
