'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : value;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5"
        role="radiogroup"
        aria-label="Rating selection"
        onMouseLeave={() => !disabled && setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? 's' : ''} - ${RATING_LABELS[star]}`}
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => !disabled && setHoverRating(star)}
              className={`p-1 text-lg sm:text-xl transition-all duration-150 cursor-pointer ${
                disabled ? 'cursor-not-allowed opacity-60' : 'hover:scale-120'
              } focus:outline-none`}
            >
              <FontAwesomeIcon
                icon={faStar}
                className={isFilled ? 'text-[#f59e0b]' : 'text-slate-300'}
              />
            </button>
          );
        })}
        <span className="ml-2 text-xs sm:text-sm font-medium text-[#48515b] min-w-[75px]">
          {displayRating > 0 ? RATING_LABELS[displayRating] : 'Select rating'}
        </span>
      </div>
    </div>
  );
};
