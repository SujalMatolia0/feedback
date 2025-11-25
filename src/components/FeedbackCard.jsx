"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

// star rating component

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600 fill-gray-600"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

// feedback card component - displays individual feedback item with delete functionality

export default function FeedbackCard({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const openModal = () => setConfirmOpen(true)
  const closeModal = () => setConfirmOpen(false)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(item.id)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
      closeModal()
    }
  }

  return (
    <>
      <div className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {item.name ? item.name.charAt(0).toUpperCase() : "?"}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-100 text-base sm:text-lg truncate">{item.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{item.email}</p>
              <p className="mt-3 text-gray-300 wrap-break-word text-sm">{item.message}</p>

              <div className="mt-4 md:hidden">
                <StarRating rating={item.rating} />
              </div>

              <p className="mt-3 text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
            <StarRating rating={item.rating} />
            <button
              onClick={openModal}
              disabled={deleting}
              className="p-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete feedback"
            >
              {deleting ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={openModal}
            disabled={deleting}
            className="w-full p-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {deleting ? (
              <>
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Delete Feedback</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this feedback? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
