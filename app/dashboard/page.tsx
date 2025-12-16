"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Users, CheckCircle2, XCircle, LogOut, LogIn } from "lucide-react"
import { AttendanceChart } from "@/components/attendance-chart"
import { LeaveRequestsTable } from "@/components/leave-requests-table"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { clockIn, clockOut, getAttendanceStats } from "@/lib/api/attendance"
import { getLeaveBalance } from "@/lib/api/leave"
import { getTeamAttendanceSummary } from "@/lib/api/team"
import { getCurrentUser } from "@/lib/api/auth"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState("")
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<string | null>(null)
  const [stats, setStats] = useState({
    hoursWorked: 0,
    daysPresent: 0,
    totalDays: 0,
    leaveBalance: 0,
    teamPresent: 0,
    teamTotal: 0,
  })
  const [userName, setUserName] = useState("User")
  const { toast } = useToast()

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    // Load clock status from localStorage
    const savedClockIn = localStorage.getItem("clockInTime")
    if (savedClockIn) {
      setIsClockedIn(true)
      setClockInTime(savedClockIn)
    }

    loadUserData()

    return () => clearInterval(interval)
  }, [])

  const loadUserData = async () => {
    const user = getCurrentUser()
    if (user) {
      setUserName(user.name)

      // Fetch attendance stats
      const attendanceStats = await getAttendanceStats(user.id)

      // Fetch leave balance
      const leaveBalance = await getLeaveBalance(user.id)

      // Fetch team attendance summary
      const teamSummary = await getTeamAttendanceSummary()

      setStats({
        hoursWorked: attendanceStats.totalHoursThisWeek,
        daysPresent: attendanceStats.daysPresent,
        totalDays: attendanceStats.totalDays,
        leaveBalance: leaveBalance.remainingLeave,
        teamPresent: teamSummary.present,
        teamTotal: teamSummary.total,
      })
    }
  }

  const handleClockIn = async () => {
    const user = getCurrentUser()
    if (!user) return

    const result = await clockIn(user.id)

    if (result.success) {
      setIsClockedIn(true)
      setClockInTime(result.time)
      localStorage.setItem("clockInTime", result.time)
      toast({
        title: "Clocked In Successfully",
        description: `You clocked in at ${result.time}`,
      })
    }
  }

  const handleClockOut = async () => {
    const user = getCurrentUser()
    if (!user) return

    const result = await clockOut(user.id)

    if (result.success) {
      setIsClockedIn(false)
      setClockInTime(null)
      localStorage.removeItem("clockInTime")

      // Update hours worked
      setStats((prev) => ({
        ...prev,
        hoursWorked: prev.hoursWorked + result.hoursWorked,
      }))

      toast({
        title: "Clocked Out Successfully",
        description: `You clocked out at ${result.time}. Have a great day!`,
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current time</p>
              <p className="text-2xl font-bold">{currentTime}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {isClockedIn ? "You're clocked in!" : "Ready to start your day?"}
                </h3>
                <p className="text-primary-foreground/80">
                  {isClockedIn ? `Clocked in at ${clockInTime}` : "Clock in to track your attendance"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" variant="secondary" className="gap-2" onClick={handleClockIn} disabled={isClockedIn}>
                  <LogIn className="w-5 h-5" />
                  Clock In
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
                  onClick={handleClockOut}
                  disabled={!isClockedIn}
                >
                  <LogOut className="w-5 h-5" />
                  Clock Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursWorked.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-accent font-medium">+2.5 hrs</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Present</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.daysPresent}/{stats.totalDays}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leaveBalance} days</div>
              <p className="text-xs text-muted-foreground mt-1">Available leave remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.teamPresent}/{stats.teamTotal}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Team members present today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Your attendance pattern this month</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceChart />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest check-ins and check-outs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "Today",
                    checkIn: isClockedIn ? clockInTime : "--:--",
                    checkOut: "--:--",
                    status: isClockedIn ? "active" : "pending",
                  },
                  { date: "Yesterday", checkIn: "09:00 AM", checkOut: "06:15 PM", status: "complete" },
                  { date: "Dec 13", checkIn: "08:55 AM", checkOut: "06:00 PM", status: "complete" },
                  { date: "Dec 12", checkIn: "--:--", checkOut: "--:--", status: "absent" },
                  { date: "Dec 11", checkIn: "09:10 AM", checkOut: "06:30 PM", status: "complete" },
                ].map((record, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      {record.status === "active" && <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />}
                      {record.status === "complete" && <CheckCircle2 className="w-4 h-4 text-accent" />}
                      {record.status === "absent" && <XCircle className="w-4 h-4 text-destructive" />}
                      {record.status === "pending" && <div className="w-2 h-2 bg-muted-foreground rounded-full" />}
                      <div>
                        <p className="font-medium text-sm">{record.date}</p>
                        <p className="text-xs text-muted-foreground">
                          In: {record.checkIn} • Out: {record.checkOut}
                        </p>
                      </div>
                    </div>
                    {record.status === "active" && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Active
                      </Badge>
                    )}
                    {record.status === "absent" && <Badge variant="destructive">Absent</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Leave Requests</CardTitle>
                <CardDescription>Team leave requests awaiting approval</CardDescription>
              </div>
              <Button variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <LeaveRequestsTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
