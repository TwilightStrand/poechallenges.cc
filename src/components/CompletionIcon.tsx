interface CompletionIconProps {
  complete: boolean;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: 16,
  md: 24,
} as const;

export function CompletionIcon({ complete, size = "md" }: CompletionIconProps) {
  const px = sizeMap[size];

  if (complete) {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
        aria-label="Completed"
      >
        <circle cx="12" cy="12" r="11" fill="#2a9d3e" stroke="#3aad4e" strokeWidth="1" />
        <path
          d="M7 12.5l3.5 3.5 6.5-7"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-label="Incomplete"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-poe-border"
      />
    </svg>
  );
}
