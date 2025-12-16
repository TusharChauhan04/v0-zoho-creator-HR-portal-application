# Database Schema for TeamFlow HR

This document provides the complete database schema needed for the HR Attendance Management System.

## Tables

### 1. users

Stores all user/employee information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
  department VARCHAR(100),
  phone VARCHAR(20),
  date_of_joining DATE,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department ON users(department);
```

### 2. attendance

Tracks daily attendance records.

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP,
  check_out TIMESTAMP,
  hours_worked DECIMAL(5,2),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'present', 'absent', 'leave', 'holiday')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

### 3. leave_requests

Manages all leave applications.

```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Sick Leave', 'Vacation', 'Personal', 'Maternity', 'Paternity', 'Bereavement')),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  rejected_by UUID REFERENCES users(id),
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_leave_user ON leave_requests(user_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_leave_dates ON leave_requests(from_date, to_date);
```

### 4. leave_balances

Tracks leave balance for each user.

```sql
CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  total_leave INTEGER NOT NULL DEFAULT 20,
  used_leave INTEGER NOT NULL DEFAULT 0,
  remaining_leave INTEGER NOT NULL DEFAULT 20,
  sick_leave INTEGER DEFAULT 10,
  casual_leave INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, year)
);

-- Indexes
CREATE INDEX idx_leave_balance_user_year ON leave_balances(user_id, year);
```

### 5. departments

Manages company departments.

```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  manager_id UUID REFERENCES users(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. holidays

Company-wide holiday calendar.

```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_holidays_date ON holidays(date);
```

### 7. sessions

For authentication session management.

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
```

## Sample Data

### Insert demo user

```sql
-- Password: demo123 (you should hash this with bcrypt)
INSERT INTO users (email, password_hash, name, employee_id, role, department, date_of_joining) 
VALUES (
  'demo@company.com',
  '$2b$10$YourHashedPasswordHere',
  'John Doe',
  'EMP001',
  'manager',
  'Engineering',
  '2023-01-15'
);
```

### Insert leave balance for demo user

```sql
INSERT INTO leave_balances (user_id, year, total_leave, used_leave, remaining_leave)
SELECT id, 2025, 20, 8, 12
FROM users WHERE email = 'demo@company.com';
```

## Database Functions

### Calculate hours worked

```sql
CREATE OR REPLACE FUNCTION calculate_hours_worked()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.check_out IS NOT NULL AND NEW.check_in IS NOT NULL THEN
    NEW.hours_worked := EXTRACT(EPOCH FROM (NEW.check_out - NEW.check_in)) / 3600;
    NEW.status := 'present';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attendance_hours_trigger
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION calculate_hours_worked();
```

### Update leave balance after approval

```sql
CREATE OR REPLACE FUNCTION update_leave_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE leave_balances
    SET 
      used_leave = used_leave + NEW.days,
      remaining_leave = remaining_leave - NEW.days
    WHERE user_id = NEW.user_id 
    AND year = EXTRACT(YEAR FROM NEW.from_date);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leave_balance_trigger
AFTER UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION update_leave_balance();
```

## Row Level Security (RLS) for Supabase

If using Supabase, enable RLS:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can view their attendance
CREATE POLICY "Users can view own attendance" ON attendance
  FOR SELECT USING (auth.uid() = user_id);

-- Users can clock in/out
CREATE POLICY "Users can clock in/out" ON attendance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance" ON attendance
  FOR UPDATE USING (auth.uid() = user_id);

-- Managers can view team data
CREATE POLICY "Managers can view team data" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );
```

## Notes

- All timestamps are in UTC
- Use bcrypt for password hashing (minimum 10 rounds)
- Implement proper indexing for performance
- Set up foreign key constraints for data integrity
- Add triggers for automated calculations
- Enable RLS if using Supabase for security
