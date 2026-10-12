/** Lucide pencil-sparkles geometry: pencil in ink, sparkles in primary. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15.007 5.008 3.987 3.986" />
      <path d="M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <g className="stroke-primary text-primary">
        <path d="M10 3H8" />
        <path d="M20 15v4" />
        <path d="M22 17h-4" />
        <path d="M4 5v4" />
        <path d="M6 7H2" />
        <path d="M9 2v2" />
      </g>
    </svg>
  )
}
