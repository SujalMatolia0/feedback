"use client"

import { useState } from "react"

// FilterBar Component - allows users to filter feedbacks by various criteria

export default function FilterBar({ categories = [], onChange }) {
  const [q, setQ] = useState("")
  const [category, setCategory] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sort, setSort] = useState("newest")

  const apply = () => onChange?.({ q, category, dateFrom, dateTo, sort })

  return (
    <div className="bg-gray-800/70 p-3 sm:p-4 rounded-xl border border-gray-700 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Search name, email or message..."
          className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest rating</option>
          <option value="lowest">Lowest rating</option>
        </select>

        <button
          onClick={apply}
          className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          Apply
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-center text-sm">
        <label className="flex items-center gap-2">
          <span className="text-gray-400">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="text-gray-400">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <button
          onClick={() => {
            setQ("")
            setCategory("all")
            setDateFrom("")
            setDateTo("")
            setSort("newest")
            onChange?.({
              q: "",
              category: "all",
              dateFrom: "",
              dateTo: "",
              sort: "newest",
            })
          }}
          className="text-sm text-indigo-400 hover:text-indigo-300 underline transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
