"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getPendingLeaveRequests, approveLeaveRequest, rejectLeaveRequest, type LeaveRequest } from "@/lib/api/leave"

export function LeaveRequestsTable() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadLeaveRequests()
  }, [])

  const loadLeaveRequests = async () => {
    setIsLoading(true)
    try {
      const requests = await getPendingLeaveRequests()
      setLeaveRequests(requests)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string, employeeName: string) => {
    try {
      const result = await approveLeaveRequest(id)

      if (result.success) {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id))
        toast({
          title: "Leave Approved",
          description: `${employeeName}'s leave request has been approved.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string, employeeName: string) => {
    try {
      const result = await rejectLeaveRequest(id)

      if (result.success) {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id))
        toast({
          title: "Leave Rejected",
          description: `${employeeName}'s leave request has been rejected.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">Loading leave requests...</p>
      </div>
    )
  }

  if (leaveRequests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No pending leave requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {leaveRequests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{request.employeeName}</p>
              <Badge variant="outline" className="text-xs">
                {request.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(request.fromDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
              {new Date(request.toDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ({request.days}{" "}
              {request.days === 1 ? "day" : "days"})
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-destructive hover:text-destructive border-destructive/30 bg-transparent"
              onClick={() => handleReject(request.id, request.employeeName)}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-accent hover:bg-accent/90"
              onClick={() => handleApprove(request.id, request.employeeName)}
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
