export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
      <div className="h-4 bg-linear-to-r from-gray-700 to-gray-600 rounded w-1/3"></div>
      <div className="h-3 bg-linear-to-r from-gray-700/70 to-gray-600/70 rounded w-2/3"></div>
      <div className="h-3 bg-linear-to-r from-gray-700/70 to-gray-600/70 rounded"></div>
    </div>
  )
}
