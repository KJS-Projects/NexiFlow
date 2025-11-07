// app/components/InstantFilter.js
"use client";

import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function InstantFilter() {
  const router = useRouter();

  const handleFilterChange = useDebouncedCallback((formData) => {
    const params = new URLSearchParams();

    // Add all form values to URL params
    for (const [key, value] of formData.entries()) {
      if (value) {
        params.set(key, value);
      }
    }

    router.push(`/browse?${params.toString()}`);
  }, 300);

  return (
    <form
      onChange={(e) => {
        const formData = new FormData(e.currentTarget);
        handleFilterChange(formData);
      }}
      className="contents">
      {/* This form will be populated by the filter inputs */}
    </form>
  );
}
