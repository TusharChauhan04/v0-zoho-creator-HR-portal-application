// Authentication API Service
// TODO: Replace mock data with real API calls to your backend

export interface User {
  id: string
  name: string
  email: string
  employeeId: string
  role: "employee" | "manager" | "admin"
  department?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Mock user database - Replace with real database queries
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "demo@company.com",
    employeeId: "EMP001",
    role: "manager",
    department: "Engineering",
  },
]

/**
 * Login user with credentials
 * TODO: Replace with real API call
 * Example: POST /api/auth/login
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // TODO: Replace this with actual API call
  // const response = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(credentials)
  // });
  // return response.json();

  // Mock authentication logic
  const user = MOCK_USERS.find((u) => u.email === credentials.email && credentials.password === "demo123")

  if (user) {
    return {
      success: true,
      user,
      token: "mock-jwt-token-" + Date.now(),
    }
  }

  return {
    success: false,
    message: "Invalid credentials",
  }
}

/**
 * Logout user
 * TODO: Replace with real API call
 * Example: POST /api/auth/logout
 */
export async function logoutUser(): Promise<void> {
  // TODO: Call your backend to invalidate session/token
  // await fetch('/api/auth/logout', { method: 'POST' });

  // Clear local storage
  localStorage.removeItem("user")
  localStorage.removeItem("authToken")
}

/**
 * Get current user from session
 * TODO: Replace with real API call to validate session
 */
export function getCurrentUser(): User | null {
  // TODO: Validate with backend instead of just reading localStorage
  // const response = await fetch('/api/auth/me');
  // return response.json();

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}
