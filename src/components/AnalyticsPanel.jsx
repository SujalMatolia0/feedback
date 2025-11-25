"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"

// Tooltip for Category Breakdown Chart

function CategoryTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0]
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
      <div className="font-bold text-gray-100 mb-2 capitalize">{p.payload.category}</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Count:</span>
          <span className="font-semibold text-gray-100">{p.value}</span>
        </div>
        {p.payload.pct != null && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Share:</span>
            <span className="font-semibold text-indigo-400">{p.payload.pct}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Tooltip for 7-Day Trend Chart

function TrendTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
      <div className="font-bold text-gray-100 mb-2">{payload[0].payload.date}</div>
      <div className="space-y-1 text-sm">
        {payload.map((p, idx) => (
          <div key={idx} className="flex justify-between gap-4">
            <span className="text-gray-400">{p.name}:</span>
            <span className="font-semibold" style={{ color: p.color }}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main AnalyticsCharts Component - shows category breakdown and 7-day trend charts

export default function AnalyticsCharts({ items = [] }) {
  const categoryData = useMemo(() => {
    const map = {}
    let total = 0

    items.forEach((it) => {
      const cat = it.category ? String(it.category).toLowerCase() : "general"
      map[cat] = (map[cat] || 0) + 1
      total++
    })

    const arr = Object.keys(map).map((k) => ({ category: k, count: map[k] }))
    arr.sort((a, b) => b.count - a.count)

    return arr.map((r) => ({
      ...r,
      pct: total ? +(100 * (r.count / total)).toFixed(1) : 0,
    }))
  }, [items])

  const trendData = useMemo(() => {
    const days = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        timestamp: date.getTime(),
        count: 0,
        totalRating: 0,
        avgRating: 0,
      })
    }

    items.forEach((item) => {
      const itemDate = new Date(item.createdAt)
      itemDate.setHours(0, 0, 0, 0)
      const itemTimestamp = itemDate.getTime()

      const dayIndex = days.findIndex((d) => d.timestamp === itemTimestamp)

      if (dayIndex !== -1) {
        days[dayIndex].count++
        days[dayIndex].totalRating += Number(item.rating) || 0
      }
    })

    return days.map((d) => ({
      date: d.date,
      count: d.count,
      avgRating: d.count > 0 ? +(d.totalRating / d.count).toFixed(1) : 0,
    }))
  }, [items])

  const palette = ["#6366F1", "#EC4899", "#8B5CF6", "#F59E0B", "#10B981", "#06B6D4", "#F97316"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Category Breakdown Chart */}
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-indigo-900/30">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-100">Category Breakdown</h3>
        </div>

        {categoryData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">📊</div>
            <p className="text-gray-400 font-medium">No category data available</p>
            <p className="text-gray-500 text-sm mt-2">Categories will appear here once feedback is submitted</p>
          </div>
        ) : (
          <>
            <div className="h-48 sm:h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={80}
                    tick={{ fontSize: 12, textTransform: "capitalize", fill: "#D1D5DB" }}
                  />
                  <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.1)" }} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend */}
            <div className="flex flex-wrap gap-2">
              {categoryData.map((c, idx) => (
                <div
                  key={c.category}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: palette[idx % palette.length] }}
                  />
                  <span className="font-medium capitalize text-xs sm:text-sm text-gray-100">{c.category}</span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {c.count} ({c.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 7-Day Trend Chart */}
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-green-900/30">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-100">7-Day Trend</h3>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">📈</div>
            <p className="text-gray-400 font-medium">No trend data yet</p>
            <p className="text-gray-500 text-sm mt-2">Trends will appear here once feedback is submitted</p>
          </div>
        ) : (
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <Tooltip content={<TrendTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: "#6366F1", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                  name="Feedback Count"
                />
                <Line
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                  name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
