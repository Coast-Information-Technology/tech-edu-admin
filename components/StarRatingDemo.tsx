"use client";

import React, { useState } from "react";
import StarRating from "./ui/star-rating";

const StarRatingDemo: React.FC = () => {
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(3.5);
  const [rating3, setRating3] = useState(4);
  const [rating4, setRating4] = useState(2.5);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Star Rating Component Demo
        </h1>
        <p className="text-slate-600">
          Interactive star rating component with animations and half-star
          support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Rating */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Basic Rating (Interactive)
          </h3>
          <div className="space-y-4">
            <StarRating
              value={rating1}
              onChange={setRating1}
              size="lg"
              showValue={true}
            />
            <p className="text-sm text-slate-600">
              Current rating: {rating1.toFixed(1)}/5
            </p>
          </div>
        </div>

        {/* Half Star Rating */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Half Star Rating
          </h3>
          <div className="space-y-4">
            <StarRating
              value={rating2}
              onChange={setRating2}
              size="lg"
              showValue={true}
              allowHalf={true}
            />
            <p className="text-sm text-slate-600">
              Current rating: {rating2.toFixed(1)}/5
            </p>
          </div>
        </div>

        {/* Readonly Rating */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Readonly Rating
          </h3>
          <div className="space-y-4">
            <StarRating
              value={rating3}
              onChange={() => {}}
              size="lg"
              showValue={true}
              readonly={true}
            />
            <p className="text-sm text-slate-600">
              This rating cannot be changed
            </p>
          </div>
        </div>

        {/* Different Sizes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Different Sizes
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-12">Small:</span>
              <StarRating
                value={rating4}
                onChange={setRating4}
                size="sm"
                showValue={false}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-12">Medium:</span>
              <StarRating
                value={rating4}
                onChange={setRating4}
                size="md"
                showValue={false}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-12">Large:</span>
              <StarRating
                value={rating4}
                onChange={setRating4}
                size="lg"
                showValue={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Interactive hover effects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Half-star support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Smooth animations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Multiple sizes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Readonly mode</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Accessibility support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarRatingDemo;
