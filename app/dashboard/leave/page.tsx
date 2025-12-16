"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const mockLeaveRequests = [
  {
    id: 1,
    type: "Sick Leave",
    startDate: "2025-01-15",
    endDate: "2025-01-16",
    days: 2,
    status: "Pending",
    reason: "Fever and cold",
  },
  {
    id: 2,
    type: "Casual Leave",
    startDate: "2025-01-20",
    endDate: "2025-01-20",
    days: 1,
    status: "Approved",
    reason: "Personal work",
  },
  {
    id: 3,
    type: "Vacation",
    startDate: "2025-02-10",
    endDate: "2025-02-15",
    days: 6,
    status: "Pending",
    reason: "Family trip",
  },
]

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmitLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newRequest = {
      id: leaveRequests.length + 1,
      type: formData.get("type") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      days: 1, // Calculate based on dates
      status: "Pending" as const,
      reason: formData.get("reason") as string,
    }

    setLeaveRequests([newRequest, ...leaveRequests])
    setDialogOpen(false)
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    })
  }

  const leaveBalance = {
    casual: 12,
    sick: 10,
    vacation: 15,
  }

  const usedLeave = {
    casual: 3,
    sick: 2,
    vacation: 0,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
            <p className="text-muted-foreground">Manage your leave requests and balance</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Apply for Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave request</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmitLeave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Leave Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Vacation">Vacation</SelectItem>
                      <SelectItem value="Work From Home">Work From Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" name="startDate" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" name="endDate" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea name="reason" placeholder="Please provide a reason for your leave" required />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.casual - usedLeave.casual}</div>
              <p className="text-xs text-muted-foreground">of {leaveBalance.casual} days available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.sick - usedLeave.sick}</div>
              <p className="text-xs text-muted-foreground">of {leaveBalance.sick} days available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacation</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.vacation - usedLeave.vacation}</div>
              <p className="text-xs text-muted-foreground">of {leaveBalance.vacation} days available</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>View and track your leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{request.type}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : request.status === "Rejected"
                              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                        }`}
                      >
                        {request.status === "Approved" && <CheckCircle className="inline w-3 h-3 mr-1" />}
                        {request.status === "Rejected" && <XCircle className="inline w-3 h-3 mr-1" />}
                        {request.status === "Pending" && <Clock className="inline w-3 h-3 mr-1" />}
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()} ({request.days}{" "}
                      {request.days === 1 ? "day" : "days"})
                    </p>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
