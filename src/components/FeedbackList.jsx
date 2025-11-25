import { useEffect, useState, useCallback } from "react";
import { getFeedbacks, deleteFeedback } from "../services/feedbackService";
import FeedbackCard from "./FeedbackCard";
import Skeleton from "./Skeleton";
import { toast } from "react-hot-toast";

// FeedbackList Component - displays list of feedbacks with loading and empty states

export default function FeedbackList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFeedbacks();
      setItems(data);
    } catch {
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const onCreated = () => fetchData();
    window.addEventListener("feedback:created", onCreated);
    return () => window.removeEventListener("feedback:created", onCreated);
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      toast.success("Deleted feedback");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <h2 className="text-2xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
        Feedback List
      </h2>

      {loading ? (
        <div className="p-6 space-y-4">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-gray-400 dark:text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            No feedback yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Feedback will appear here once submitted
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {items.map((item) => (
            <FeedbackCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}