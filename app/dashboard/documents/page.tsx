"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const documents = [
  {
    id: 1,
    name: "Offer Letter",
    type: "PDF",
    size: "245 KB",
    uploadedDate: "Jan 15, 2024",
    category: "Employment",
  },
  {
    id: 2,
    name: "Tax Form W-2",
    type: "PDF",
    size: "180 KB",
    uploadedDate: "Jan 31, 2024",
    category: "Tax Documents",
  },
  {
    id: 3,
    name: "Employee Handbook",
    type: "PDF",
    size: "1.2 MB",
    uploadedDate: "Jan 15, 2024",
    category: "Company Policies",
  },
  {
    id: 4,
    name: "Payslip December 2024",
    type: "PDF",
    size: "95 KB",
    uploadedDate: "Dec 31, 2024",
    category: "Payroll",
  },
  {
    id: 5,
    name: "Performance Review 2024",
    type: "PDF",
    size: "320 KB",
    uploadedDate: "Dec 15, 2024",
    category: "Performance",
  },
  {
    id: 6,
    name: "Benefits Enrollment",
    type: "PDF",
    size: "410 KB",
    uploadedDate: "Jan 01, 2024",
    category: "Benefits",
  },
]

const categories = ["All", "Employment", "Tax Documents", "Company Policies", "Payroll", "Performance", "Benefits"]

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Access your employment documents</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button key={category} variant="outline" size="sm">
              {category}
            </Button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{doc.name}</CardTitle>
                      <CardDescription className="text-xs">{doc.uploadedDate}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary">{doc.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-xs">{doc.category}</span>
                </div>
                <Button className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
