"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { day: "Mon", hours: 9 },
  { day: "Tue", hours: 8.5 },
  { day: "Wed", hours: 9 },
  { day: "Thu", hours: 0 },
  { day: "Fri", hours: 8 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
]

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-card p-2 shadow-sm">
                  <div className="text-sm">
                    <span className="font-medium">{payload[0].value} hours</span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
