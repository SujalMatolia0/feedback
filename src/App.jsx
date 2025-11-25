import { Toaster } from "react-hot-toast"
import FeedbackGrid from "./components/FeedbackGrid"

export default function App() {
  return (
    <>
      {/* React Hot Toast - for notifications*/}
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

      <div className="min-h-screen bg-linear-to-br from-gray-900 via-indigo-950 to-gray-900">
        {/* Header */}
        <div className="bg-gray-900/60 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Feedback Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage and analyze customer feedback</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <FeedbackGrid />
        </div>
      </div>
    </>
  )
}
