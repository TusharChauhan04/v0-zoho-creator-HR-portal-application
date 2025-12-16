import { NextResponse } from "next/server"

/**
 * Get Pending Leave Requests API Route
 * GET /api/leave/pending
 *
 * TODO: Implement with your database
 * 1. Verify user is manager/admin
 * 2. Query all pending leave requests
 * 3. Join with users table to get employee details
 * 4. Return list of requests
 */
export async function GET() {
  try {
    // TODO: Query your database
    // const { data, error } = await supabase
    //   .from('leave_requests')
    //   .select(`
    //     *,
    //     users (
    //       name,
    //       employee_id
    //     )
    //   `)
    //   .eq('status', 'pending')
    //   .order('created_at', { ascending: false })

    // Mock response
    return NextResponse.json([
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
    ])
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
