import { type NextRequest, NextResponse } from "next/server"

/**
 * Reject Leave Request API Route
 * POST /api/leave/[id]/reject
 *
 * TODO: Implement with your database
 * 1. Verify user is manager/admin
 * 2. Update leave request status to rejected
 * 3. Store rejection reason
 * 4. Send notification to employee
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { reason } = await request.json()

    // TODO: Update leave request in database
    // const { error } = await supabase
    //   .from('leave_requests')
    //   .update({
    //     status: 'rejected',
    //     rejected_at: new Date().toISOString(),
    //     rejected_by: managerId,
    //     rejection_reason: reason
    //   })
    //   .eq('id', id)

    // TODO: Send notification to employee

    return NextResponse.json({
      success: true,
      message: "Leave request rejected",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
