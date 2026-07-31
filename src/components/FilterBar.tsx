"use client";

interface FilterBarProps {
	searchQuery: string;
	onSearchChange: (q: string) => void;
	showCompleted: boolean;
	onToggleCompleted: () => void;
	sortBy: string;
	onSortChange: (s: string) => void;
}

export function FilterBar({
	searchQuery,
	onSearchChange,
	showCompleted,
	onToggleCompleted,
	sortBy,
	onSortChange,
}: FilterBarProps) {
	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
			{/* Search input */}
			<div className="relative flex-1">
				<svg
					aria-hidden="true"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					className="absolute left-2.5 top-1/2 -translate-y-1/2 text-poe-text-dim"
				>
					<circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
					<path
						d="M16 16l4.5 4.5"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search..."
					aria-label="Search challenges"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="
            w-full
            bg-poe-bg-input border border-poe-border-subtle rounded
            pl-8 pr-3 py-1.5
            text-xs text-poe-text placeholder:text-poe-text-dim
            focus:outline-none focus:border-poe-border
            transition-colors
          "
				/>
			</div>

			{/* Show completed toggle */}
			<button
				type="button"
				onClick={onToggleCompleted}
				className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs whitespace-nowrap transition-colors
          ${
						showCompleted
							? "border-poe-border bg-poe-bg-input text-poe-gold-dim"
							: "border-poe-border-subtle bg-transparent text-poe-text-dim hover:text-poe-text"
					}
        `}
			>
				<span
					className={`
            inline-block w-3 h-3 rounded-sm border transition-colors
            ${showCompleted ? "border-poe-gold-dim bg-poe-gold-dim" : "border-poe-text-dim bg-transparent"}
          `}
				/>
				Completed
			</button>

			{/* Sort dropdown */}
			<select
				value={sortBy}
				aria-label="Sort challenges by"
				onChange={(e) => onSortChange(e.target.value)}
				className="
          appearance-none
          bg-poe-bg-input border border-poe-border-subtle rounded
          px-2.5 py-1.5 pr-7
          text-xs text-poe-text-dim
          cursor-pointer
          focus:outline-none focus:border-poe-border
          transition-colors
        "
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%237e7260'/%3E%3C/svg%3E")`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "right 6px center",
				}}
			>
				<option value="default">Default</option>
				<option value="difficulty">Difficulty</option>
				<option value="completion">Progress</option>
			</select>
		</div>
	);
}
