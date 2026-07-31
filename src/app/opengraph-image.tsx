import { ImageResponse } from "next/og";

export const alt = "PoE Challenge Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0c0b0a",
				fontFamily: "serif",
			}}
		>
			{/* Border frame */}
			<div
				style={{
					position: "absolute",
					inset: 16,
					border: "2px solid #3a3226",
					borderRadius: 12,
					display: "flex",
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 22,
					border: "1px solid #2a2318",
					borderRadius: 8,
					display: "flex",
				}}
			/>

			{/* Checkmark icon */}
			<svg
				width="80"
				height="80"
				viewBox="0 0 32 32"
				style={{ marginBottom: 24 }}
			>
				<title>Checkmark</title>
				<rect width="32" height="32" rx="6" fill="#151311" />
				<rect
					x="1.5"
					y="1.5"
					width="29"
					height="29"
					rx="5"
					fill="none"
					stroke="#af6025"
					strokeWidth="1.5"
				/>
				<path
					d="M9 16.5 L14 21.5 L23.5 11"
					fill="none"
					stroke="#48a842"
					strokeWidth="3.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>

			{/* Title */}
			<div
				style={{
					fontSize: 64,
					letterSpacing: "0.08em",
					color: "#c8a05c",
					textTransform: "uppercase",
					display: "flex",
				}}
			>
				Challenge Tracker
			</div>

			{/* Subtitle */}
			<div
				style={{
					fontSize: 28,
					color: "#7e7260",
					marginTop: 16,
					display: "flex",
				}}
			>
				Track your Path of Exile league challenges
			</div>

			{/* Domain */}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					fontSize: 20,
					color: "#af6025",
					letterSpacing: "0.05em",
					display: "flex",
				}}
			>
				poechallenges.cc
			</div>
		</div>,
		size,
	);
}
