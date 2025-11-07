// app/components/InfiniteScroll.js
"use client";

import { useState, useEffect, useCallback } from "react";

export default function InfiniteScroll({ children, loadMore, hasMore, loading, threshold = 200 }) {
  const [observer, setObserver] = useState(null);

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer) observer.disconnect();

      const newObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold: 1.0 }
      );

      if (node) newObserver.observe(node);
      setObserver(newObserver);
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    return () => {
      if (observer) observer.disconnect();
    };
  }, [observer]);

  return (
    <>
      {children}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !loading && <div ref={lastItemRef} className="h-4" />}

      {/* End of results */}
      {!hasMore && children.length > 0 && <div className="text-center py-8 text-gray-500">You've reached the end of the results</div>}
    </>
  );
}
