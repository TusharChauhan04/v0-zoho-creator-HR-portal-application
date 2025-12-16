"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, MapPin, CheckCircle2, XCircle, Clock } from "lucide-react"

const mockTeamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 234-567-8901",
    role: "Senior Developer",
    department: "Engineering",
    status: "Present",
    location: "New York Office",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@company.com",
    phone: "+1 234-567-8902",
    role: "Product Manager",
    department: "Product",
    status: "Present",
    location: "Remote",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@company.com",
    phone: "+1 234-567-8903",
    role: "UX Designer",
    department: "Design",
    status: "On Leave",
    location: "San Francisco Office",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.w@company.com",
    phone: "+1 234-567-8904",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "Present",
    location: "Remote",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    phone: "+1 234-567-8905",
    role: "HR Manager",
    department: "Human Resources",
    status: "Absent",
    location: "New York Office",
  },
  {
    id: 6,
    name: "David Brown",
    email: "david.b@company.com",
    phone: "+1 234-567-8906",
    role: "Marketing Lead",
    department: "Marketing",
    status: "Present",
    location: "Remote",
  },
]

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const presentCount = mockTeamMembers.filter((m) => m.status === "Present").length
  const absentCount = mockTeamMembers.filter((m) => m.status === "Absent").length
  const onLeaveCount = mockTeamMembers.filter((m) => m.status === "On Leave").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">View your team members and their status</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentCount}</div>
              <p className="text-xs text-muted-foreground">Team members working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onLeaveCount}</div>
              <p className="text-xs text-muted-foreground">Scheduled leaves</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absentCount}</div>
              <p className="text-xs text-muted-foreground">Not present today</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-sm">{member.role}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      member.status === "Present"
                        ? "default"
                        : member.status === "On Leave"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {member.location}
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{member.department}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No team members found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
