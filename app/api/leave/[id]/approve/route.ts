import { type NextRequest, NextResponse } from "next/server"

/**
 * Approve Leave Request API Route
 * POST /api/leave/[id]/approve
 *
 * TODO: Implement with your database
 * 1. Verify user is manager/admin
 * 2. Update leave request status to approved
 * 3. Update user's leave balance
 * 4. Send notification to employee
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // TODO: Update leave request in database
    // const { error } = await supabase
    //   .from('leave_requests')
    //   .update({
    //     status: 'approved',
    //     approved_at: new Date().toISOString(),
    //     approved_by: managerId
    //   })
    //   .eq('id', id)

    // TODO: Update leave balance
    // const leaveRequest = await supabase.from('leave_requests').select('*').eq('id', id).single()
    // await supabase
    //   .from('leave_balances')
    //   .update({
    //     used_leave: used_leave + leaveRequest.days
    //   })
    //   .eq('user_id', leaveRequest.user_id)

    // TODO: Send notification to employee

    return NextResponse.json({
      success: true,
      message: "Leave request approved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
