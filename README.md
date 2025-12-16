# TeamFlow HR - Attendance Management System

A modern HR attendance management application similar to Keka, built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Authentication** - Secure login system with demo account
- **Clock In/Out** - Real-time attendance tracking
- **Dashboard** - Comprehensive overview of attendance stats
- **Leave Management** - Submit and approve leave requests
- **Team Monitoring** - Track team attendance and status
- **Reports** - Attendance patterns and analytics

## Demo Account

```
Email: demo@company.com
Password: demo123
```

## Project Structure

```
├── app/
│   ├── page.tsx                 # Login page
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── layout.tsx               # Root layout
│   └── api/                     # API routes (ready for backend integration)
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── attendance/
│       │   ├── clock-in/route.ts
│       │   └── clock-out/route.ts
│       └── leave/
│           ├── pending/route.ts
│           └── [id]/
│               ├── approve/route.ts
│               └── reject/route.ts
├── components/
│   ├── dashboard-layout.tsx     # Dashboard layout with sidebar
│   ├── attendance-chart.tsx     # Attendance visualization
│   ├── leave-requests-table.tsx # Leave management table
│   └── ui/                      # Reusable UI components
├── lib/
│   └── api/                     # API service layer (frontend)
│       ├── auth.ts              # Authentication services
│       ├── attendance.ts        # Attendance services
│       ├── leave.ts             # Leave management services
│       └── team.ts              # Team management services
└── hooks/                       # Custom React hooks
```

## API Integration Guide

The application is structured with a **service layer** (`lib/api/*`) that contains all mock data and API calls. This makes it easy to integrate with your real backend.

### Steps to Integrate with Your Backend:

#### 1. **Database Setup**

Create the following tables in your database (example schema):

**users**
```sql
- id (primary key)
- name
- email (unique)
- password_hash
- employee_id (unique)
- role (employee/manager/admin)
- department
- created_at
```

**attendance**
```sql
- id (primary key)
- user_id (foreign key)
- date
- check_in (timestamp)
- check_out (timestamp)
- hours_worked
- status (active/present/absent/leave)
- created_at
```

**leave_requests**
```sql
- id (primary key)
- user_id (foreign key)
- type (sick/vacation/personal/maternity/paternity)
- from_date
- to_date
- days
- reason
- status (pending/approved/rejected)
- approved_by (foreign key)
- created_at
```

**leave_balances**
```sql
- id (primary key)
- user_id (foreign key)
- year
- total_leave
- used_leave
- remaining_leave
```

#### 2. **Update API Routes**

All API routes are in `app/api/*` with TODO comments showing exactly where to add your database queries.

Example - Update `app/api/auth/login/route.ts`:

```typescript
// Replace the mock response with real database query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single()

// Verify password
const isValidPassword = await bcrypt.compare(password, data.password_hash)

// Create JWT token
const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET!)
```

#### 3. **Update Service Layer**

Update the functions in `lib/api/*` to call your actual API routes instead of returning mock data:

```typescript
// lib/api/auth.ts
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  return response.json()
}
```

#### 4. **Add Environment Variables**

Create a `.env.local` file:

```env
# Database
DATABASE_URL=your_database_url

# Authentication
JWT_SECRET=your_secret_key_here

# Other integrations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 5. **Install Dependencies**

If using Supabase:
```bash
npm install @supabase/supabase-js
```

If using authentication:
```bash
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

## Current Implementation

The app currently uses:
- **Mock data** in service layer (`lib/api/*`)
- **LocalStorage** for session persistence (demo only)
- **Client-side state** for real-time updates
- **TODO comments** marking integration points

## Next Steps for Production

1. ✅ Replace mock data with database queries
2. ✅ Implement JWT authentication with HTTP-only cookies
3. ✅ Add password hashing with bcrypt
4. ✅ Set up Row Level Security (if using Supabase)
5. ✅ Add API rate limiting
6. ✅ Implement proper error handling
7. ✅ Add email notifications for leave approvals
8. ✅ Add file upload for documents
9. ✅ Implement role-based access control
10. ✅ Add audit logs

## Deployment to Zoho Creator

Once the app is working as expected, you can recreate it in Zoho Creator:

1. Use the database schema as reference for Zoho forms
2. Recreate the UI components using Zoho Creator's builder
3. Implement the business logic in Deluge Script
4. Set up workflows for leave approvals
5. Configure user roles and permissions

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features Ready for Backend Integration

- ✅ Authentication with session management
- ✅ Clock in/out functionality
- ✅ Attendance statistics calculation
- ✅ Leave request submission and approval
- ✅ Team attendance monitoring
- ✅ Real-time dashboard updates
- ✅ Role-based UI (manager vs employee views)

All features are functional with mock data and ready to connect to your backend!
