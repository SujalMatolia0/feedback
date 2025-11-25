"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import FeedbackCard from "./FeedbackCard"
import FeedbackForm from "./FeedbackForm"
import { getFeedbacks, deleteFeedback } from "../services/feedbackService"
import { AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import FilterBar from "./FilterBar"
import QuickInsights from "./QuickInsights"
import { Download } from "lucide-react"
import Skeleton from "./Skeleton"
import AnalyticsCharts from "./AnalyticsPanel.jsx"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

// Main FeedbackGrid Component - use to display feedback list with filtering, sorting, and analytics

export default function FeedbackGrid() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    q: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
    sort: "newest",
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFeedbacks()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to load feedbacks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const onCreated = () => fetchData()
    window.addEventListener("feedback:created", onCreated)
    return () => window.removeEventListener("feedback:created", onCreated)
  }, [fetchData])

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id)
      toast.success("Deleted successfully")
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete")
    }
  }

  const categories = useMemo(() => {
    const defaults = ["bug", "feature", "complaint", "praise"]
    const fromData = Array.from(new Set(items.map((i) => i.category).filter(Boolean)))
    return Array.from(new Set([...defaults, ...fromData]))
  }, [items])

  const filtered = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase()
    return items
      .filter((i) => {
        if (filters.category && filters.category !== "all") {
          const c = (i.category || "general").toLowerCase()
          if (c !== String(filters.category).toLowerCase()) return false
        }
        if (q) {
          const hay = `${i.name || ""} ${i.email || ""} ${i.message || ""}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        if (filters.dateFrom) {
          if (new Date(i.createdAt) < new Date(filters.dateFrom)) return false
        }
        if (filters.dateTo) {
          const dayEnd = new Date(filters.dateTo)
          dayEnd.setHours(23, 59, 59, 999)
          if (new Date(i.createdAt) > dayEnd) return false
        }
        return true
      })
      .sort((a, b) => {
        if (filters.sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
        if (filters.sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
        if (filters.sort === "highest") return (Number(b.rating) || 0) - (Number(a.rating) || 0)
        if (filters.sort === "lowest") return (Number(a.rating) || 0) - (Number(b.rating) || 0)
        return 0
      })
  }, [items, filters])

  const handleExport = () => {
    try {
      const csv = [
        ["Name", "Email", "Rating", "Category", "Message", "Date"],
        ...filtered.map((i) => [
          i.name ?? "",
          i.email ?? "",
          i.rating ?? "",
          i.category || "general",
          (i.message || "").replace(/"/g, '""'),
          new Date(i.createdAt).toLocaleString(),
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `feedback-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Exported successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Export failed")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left Column: Form + Analytics Charts */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">
        <FeedbackForm />
        <AnalyticsCharts items={items} />
      </div>

      {/* Right Column: Feedback List + Quick Insights */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/50 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Feedback Overview
              </h2>
              <p className="text-gray-400 mt-1 text-sm">{filtered.length} results found</p>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Download size={18} />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <FilterBar categories={categories} onChange={(f) => setFilters(f)} />

        {/* Main Content: Feedback List + Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feedback List Section - Left 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-gray-100">Recent Feedback</h3>
              <span className="text-xs sm:text-sm text-gray-400">Sorted by {filters.sort}</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-20 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50"
              >
                <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📭</div>
                <p className="text-gray-300 text-lg sm:text-xl font-semibold mb-2">No feedback found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or check back later</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((item) => (
                    <FeedbackCard key={item.id} item={item} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Quick Insights - Right column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <QuickInsights items={filtered} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
