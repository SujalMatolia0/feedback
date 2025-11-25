"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { createFeedback } from "../services/feedbackService"
import StarRating from "./StarRating"
import toast from "react-hot-toast"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

// Feedback Form Component - allows users to submit feedback

export default function FeedbackForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    rating: 0,
  })
  const [loading, setLoading] = useState(false)

  const CATEGORIES = ["bug", "feature", "complaint", "praise"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const handleRating = (value) => setForm((s) => ({ ...s, rating: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim() || !form.rating) {
      toast.error("Please complete all fields and select a rating.")
      return
    }

    setLoading(true)
    try {
      await createFeedback(form)
      toast.success("Feedback submitted")
      window.dispatchEvent(new CustomEvent("feedback:created"))
      onCreated?.()
      setForm({ name: "", email: "", category: "", message: "", rating: 0 })
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32 }}
      onSubmit={handleSubmit}
      className="bg-gray-800/70 backdrop-blur rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-md"
    >
      <h2 className="text-base sm:text-lg font-semibold text-gray-100">Share Feedback</h2>
      <p className="text-xs sm:text-sm text-gray-400 mb-4">Your feedback helps us improve. Be honest and kind.</p>

      <div className="space-y-3">
        <label className="block">
          <span className="text-xs sm:text-sm text-gray-300">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your full name"
            aria-label="Your name"
          />
        </label>

        <label className="block">
          <span className="text-xs sm:text-sm text-gray-300">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
            aria-label="Your email"
          />
        </label>

        <label className="block">
          <span className="text-xs sm:text-sm text-gray-300">Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Category"
          >
            <option value="">General</option>
            {CATEGORIES.map((c) => (
              <option value={c} key={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs sm:text-sm text-gray-300">Rating</span>
          <div className="mt-2">
            <StarRating value={form.rating} onChange={handleRating} />
          </div>
        </label>

        <label className="block">
          <span className="text-xs sm:text-sm text-gray-300">Message</span>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Tell us what you think..."
            aria-label="Your message"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-95 disabled:opacity-60 transition-opacity"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={16} />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
}
