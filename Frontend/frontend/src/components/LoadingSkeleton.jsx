import React from "react";

/**
 * LoadingSkeleton — Minimalist pulsing lines.
 */
const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 py-2">
      <div className="skeleton-line h-3.5 w-full" />
      <div className="skeleton-line h-3.5 w-11/12" />
      <div className="skeleton-line h-3.5 w-10/12" />
      <div className="skeleton-line h-3.5 w-full" />
      <div className="skeleton-line h-3.5 w-9/12" />
      <div className="skeleton-line h-3.5 w-11/12" />
    </div>
  );
};

export default LoadingSkeleton;
