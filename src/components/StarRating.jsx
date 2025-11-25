import React, { useState } from "react";
import { Star } from "lucide-react";

// StarRating Component - allows users to select a star rating

export default function StarRating({ value = 0, onChange = () => {}, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            onClick={() => !readonly && onChange(n)}
            onMouseEnter={() => !readonly && setHover(n)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`p-1 rounded-md transition-transform ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            aria-label={`${n} star`}
          >
            <Star
              size={20}
              className={`
                ${active ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
