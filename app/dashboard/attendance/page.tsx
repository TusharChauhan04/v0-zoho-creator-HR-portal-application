"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarDays, CheckCircle2, XCircle, Clock3 } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock attendance data for the current month
const generateAttendanceData = () => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const attendance: Record<string, { status: "present" | "absent" | "half-day"; clockIn?: string; clockOut?: string }> =
    {}

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dayOfWeek = date.getDay()

    // Skip future dates
    if (date > today) continue

    // Weekend - no attendance
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    const dateKey = date.toISOString().split("T")[0]

    // Random attendance pattern for demo
    const random = Math.random()
    if (random > 0.9) {
      attendance[dateKey] = { status: "absent" }
    } else if (random > 0.8) {
      attendance[dateKey] = { status: "half-day", clockIn: "09:30 AM", clockOut: "02:00 PM" }
    } else {
      attendance[dateKey] = {
        status: "present",
        clockIn: `${Math.floor(Math.random() * 2) + 9}:${Math.random() > 0.5 ? "00" : "30"} AM`,
        clockOut: `${Math.floor(Math.random() * 2) + 5}:${Math.random() > 0.5 ? "00" : "30"} PM`,
      }
    }
  }

  return attendance
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [attendanceData] = useState(generateAttendanceData())

  // Calculate stats
  const totalDays = Object.keys(attendanceData).length
  const presentDays = Object.values(attendanceData).filter((d) => d.status === "present").length
  const absentDays = Object.values(attendanceData).filter((d) => d.status === "absent").length
  const halfDays = Object.values(attendanceData).filter((d) => d.status === "half-day").length

  const selectedDateKey = selectedDate?.toISOString().split("T")[0]
  const selectedAttendance = selectedDateKey ? attendanceData[selectedDateKey] : null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track your attendance and working hours</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDays}</div>
              <p className="text-xs text-muted-foreground">Working days this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentDays}</div>
              <p className="text-xs text-muted-foreground">
                {totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absentDays}</div>
              <p className="text-xs text-muted-foreground">Days missed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Half Days</CardTitle>
              <Clock3 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{halfDays}</div>
              <p className="text-xs text-muted-foreground">Partial attendance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>Select a date to view attendance details</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  present: (date) => {
                    const key = date.toISOString().split("T")[0]
                    return attendanceData[key]?.status === "present"
                  },
                  absent: (date) => {
                    const key = date.toISOString().split("T")[0]
                    return attendanceData[key]?.status === "absent"
                  },
                  halfDay: (date) => {
                    const key = date.toISOString().split("T")[0]
                    return attendanceData[key]?.status === "half-day"
                  },
                }}
                modifiersClassNames={{
                  present: "bg-green-500 text-white hover:bg-green-600",
                  absent: "bg-red-500 text-white hover:bg-red-600",
                  halfDay: "bg-orange-500 text-white hover:bg-orange-600",
                }}
              />

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <span>Half Day</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card>
            <CardHeader>
              <CardTitle>Day Details</CardTitle>
              <CardDescription>
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedAttendance ? (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        selectedAttendance.status === "present" && "bg-green-500",
                        selectedAttendance.status === "absent" && "bg-red-500",
                        selectedAttendance.status === "half-day" && "bg-orange-500",
                      )}
                    />
                    <span className="font-medium capitalize">{selectedAttendance.status.replace("-", " ")}</span>
                  </div>

                  {selectedAttendance.status !== "absent" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Clock In</p>
                          <p className="font-medium">{selectedAttendance.clockIn}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <Clock className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Clock Out</p>
                          <p className="font-medium">{selectedAttendance.clockOut}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                        <p className="text-xl font-bold">
                          {selectedAttendance.status === "half-day" ? "4.5 hrs" : "8.0 hrs"}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAttendance.status === "absent" && (
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">No attendance recorded for this day.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {selectedDate && selectedDate > new Date()
                      ? "Future date selected. No attendance data available."
                      : "No attendance data for this day."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
