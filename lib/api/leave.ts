// Leave Management API Service
// TODO: Replace mock data with real API calls to your backend

export interface LeaveRequest {
  id: string
  userId: string
  employeeName: string
  type: "Sick Leave" | "Vacation" | "Personal" | "Maternity" | "Paternity"
  fromDate: string
  toDate: string
  days: number
  reason?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface LeaveBalance {
  userId: string
  totalLeave: number
  usedLeave: number
  remainingLeave: number
  year: number
}

// Mock leave requests - Replace with database
const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "1",
    userId: "2",
    employeeName: "Sarah Johnson",
    type: "Sick Leave",
    fromDate: "2025-12-18",
    toDate: "2025-12-20",
    days: 3,
    reason: "Medical appointment",
    status: "pending",
    createdAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "3",
    employeeName: "Mike Chen",
    type: "Vacation",
    fromDate: "2025-12-22",
    toDate: "2025-12-29",
    days: 7,
    reason: "Family vacation",
    status: "pending",
    createdAt: "2025-12-14T14:30:00Z",
  },
  {
    id: "3",
    userId: "4",
    employeeName: "Emma Wilson",
    type: "Personal",
    fromDate: "2025-12-16",
    toDate: "2025-12-16",
    days: 1,
    reason: "Personal matters",
    status: "pending",
    createdAt: "2025-12-13T09:15:00Z",
  },
]

/**
 * Get all pending leave requests (for managers/admin)
 * TODO: Replace with real database query
 * Example: GET /api/leave/pending
 */
export async function getPendingLeaveRequests(): Promise<LeaveRequest[]> {
  // TODO: Query your database for pending leave requests
  // const response = await fetch('/api/leave/pending');
  // return response.json();

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return MOCK_LEAVE_REQUESTS.filter((req) => req.status === "pending")
}

/**
 * Approve leave request
 * TODO: Replace with real API call
 * Example: POST /api/leave/{id}/approve
 */
export async function approveLeaveRequest(leaveId: string): Promise<{ success: boolean; message: string }> {
  // TODO: Update database record
  // const response = await fetch(`/api/leave/${leaveId}/approve`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' }
  // });
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "Leave request approved successfully",
  }
}

/**
 * Reject leave request
 * TODO: Replace with real API call
 * Example: POST /api/leave/{id}/reject
 */
export async function rejectLeaveRequest(
  leaveId: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  // TODO: Update database record with rejection reason
  // const response = await fetch(`/api/leave/${leaveId}/reject`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ reason })
  // });
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "Leave request rejected",
  }
}

/**
 * Get user leave balance
 * TODO: Replace with real database query
 * Example: GET /api/leave/balance?userId={userId}
 */
export async function getLeaveBalance(userId: string): Promise<LeaveBalance> {
  // TODO: Query your database for user leave balance
  // const response = await fetch(`/api/leave/balance?userId=${userId}`);
  // return response.json();

  return {
    userId,
    totalLeave: 20,
    usedLeave: 8,
    remainingLeave: 12,
    year: 2025,
  }
}

/**
 * Submit new leave request
 * TODO: Replace with real API call
 * Example: POST /api/leave/request
 */
export async function submitLeaveRequest(
  userId: string,
  leaveData: Omit<LeaveRequest, "id" | "userId" | "status" | "createdAt">,
): Promise<{ success: boolean; leaveId?: string; message: string }> {
  // TODO: Insert into database
  // const response = await fetch('/api/leave/request', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ userId, ...leaveData })
  // });
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    leaveId: Date.now().toString(),
    message: "Leave request submitted successfully",
  }
}
