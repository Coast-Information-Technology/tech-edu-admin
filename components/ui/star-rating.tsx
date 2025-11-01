"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
  allowHalf?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
  showValue = true,
  allowHalf = true,
  className = "",
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleStarClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
      // Add a brief visual feedback
      setHoveredRating(rating);
      setTimeout(() => setHoveredRating(null), 200);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!readonly) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(null);
    }
  };

  const getStarColor = (starIndex: number) => {
    const currentRating = hoveredRating || value;
    const isFilled = starIndex <= currentRating;
    const isHovered = hoveredRating === starIndex;

    if (isHovered) {
      return "text-yellow-500";
    } else if (isFilled) {
      return "text-yellow-400";
    }
    return "text-gray-300";
  };

  const getStarAnimation = (starIndex: number) => {
    const currentRating = hoveredRating || value;
    const isFilled = starIndex <= currentRating;
    const isHovered = hoveredRating === starIndex;

    if (isHovered) {
      return "animate-bounce";
    } else if (isFilled) {
      return "animate-pulse";
    }
    return "";
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoveredRating || value;
    const isFilled = starIndex <= currentRating;
    const isHalfFilled =
      allowHalf &&
      starIndex - 0.5 <= currentRating &&
      currentRating < starIndex;

    if (isFilled) {
      return "fill-current";
    } else if (isHalfFilled) {
      return "fill-current opacity-50";
    }
    return "";
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          return (
            <button
              key={starNumber}
              type="button"
              onClick={() => handleStarClick(starNumber)}
              onMouseEnter={() => handleStarHover(starNumber)}
              disabled={readonly}
              className={`
                ${sizeClasses[size]} 
                ${getStarColor(starNumber)} 
                ${getStarAnimation(starNumber)}
                transition-all duration-300 
                ${
                  !readonly
                    ? "hover:scale-110 cursor-pointer"
                    : "cursor-default"
                }
                transform hover:rotate-12
                ${
                  !readonly
                    ? "hover:drop-shadow-lg hover:shadow-yellow-200"
                    : ""
                }
                group relative
                ${
                  hoveredRating === starNumber
                    ? "drop-shadow-lg shadow-yellow-200"
                    : ""
                }
              `}
              aria-label={`Rate ${starNumber} out of ${max} stars`}
            >
              <Star className={`w-full h-full ${getStarFill(starNumber)}`} />
              {allowHalf && !readonly && (
                <div className="absolute inset-0 flex">
                  <div
                    className="w-1/2 h-full overflow-hidden"
                    onMouseEnter={() => handleStarHover(starNumber - 0.5)}
                    onClick={() => handleStarClick(starNumber - 0.5)}
                  />
                  <div
                    className="w-1/2 h-full overflow-hidden"
                    onMouseEnter={() => handleStarHover(starNumber)}
                    onClick={() => handleStarClick(starNumber)}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">/ {max}</span>
        </div>
      )}
    </div>
  );
};

export default StarRating;
