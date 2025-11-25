"use client"

import { useMemo } from "react"
import { Target, MessageSquare } from "lucide-react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

// Main QuickInsights Component - shows key metrics about feedbacks

export default function QuickInsights({ items = [] }) {
  const metrics = useMemo(() => {
    const total = items.length

    const categoryMap = {}
    items.forEach((it) => {
      const cat = it.category ? String(it.category).toLowerCase() : "general"
      categoryMap[cat] = (categoryMap[cat] || 0) + 1
    })

    const topCategory = Object.keys(categoryMap).reduce((a, b) => (categoryMap[a] > categoryMap[b] ? a : b), "—")

    const ratedItems = items.filter((i) => Number(i.rating) > 0 && Number(i.rating) <= 5)
    const avgRating = ratedItems.length
      ? (ratedItems.reduce((sum, i) => sum + Number(i.rating), 0) / ratedItems.length).toFixed(1)
      : "0.0"

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const thisWeek = items.filter((i) => new Date(i.createdAt) >= weekAgo).length

    return { total, topCategory, avgRating, thisWeek }
  }, [items])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5" />
        <h3 className="text-lg font-bold">Quick Insights</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-indigo-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Total Feedback
          </span>
          <span className="font-bold text-2xl">{metrics.total}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-indigo-100">Top Category</span>
          <span className="font-bold text-xl capitalize">{metrics.topCategory}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-indigo-100">Avg Rating</span>
          <span className="font-bold text-xl">{metrics.avgRating} ⭐</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-indigo-100">This Week</span>
          <span className="font-bold text-xl">{metrics.thisWeek}</span>
        </div>
      </div>
    </motion.div>
  )
}
