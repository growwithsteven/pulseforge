import { Audio } from "@remotion/media";
import { useAudioData } from "@remotion/media-utils";
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./math";
import type { AudioVisualizerProps } from "./types";
import { useAudioFft } from "./useAudioFft";

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
	audioSrc,
	imageSrc,
	artistName,
	trackName,
	barCount,
	baseColor,
	glowColor,
	controls,
}) => {
	const frame = useCurrentFrame();
	const { width, fps } = useVideoConfig();
	const resolvedAudioSrc = staticFile(audioSrc);
	const resolvedImageSrc = staticFile(imageSrc);
	const audioData = useAudioData(resolvedAudioSrc);

	const bars = useAudioFft({
		audioData,
		frame,
		fps,
		numberOfSamples: barCount,
	});

	const barWidth = 6;
	const barGap = 6;
	const totalVisualizerWidth = barCount * (barWidth + barGap);
	const startX = (width - totalVisualizerWidth) / 2;

	// Default multipliers based on the controls
	const energy = controls?.energy ?? 5; // 1-10
	const heightMultiplier = (energy / 5) * 200; // Base max height 200px

	return (
		<AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
			<Audio src={resolvedAudioSrc} />

			{/* Backdrop Layer */}
			<AbsoluteFill>
				<Img
					src={resolvedImageSrc}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
				/>
				{/* Dark Overlay for Text/Visualizer Contrast */}
				<AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
			</AbsoluteFill>

			{/* Centered Content Container */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: startX,
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					gap: 40, // Space between visualizer and text
					zIndex: 10,
				}}
			>
				{/* Audio Reactivity Layer */}
				<div
					style={{
						display: "flex",
						gap: barGap,
						alignItems: "flex-end", // Align bars to the bottom of the visualizer container
						height: heightMultiplier + 20, // Buffer
					}}
				>
					{bars.map((sample, i) => {
						// Add a little smooth wave effect based on position
						const normalized = clamp(sample, 0, 1);
						const barHeight = Math.max(4, normalized * heightMultiplier);

						return (
							<div
								key={i}
								style={{
									width: barWidth,
									height: barHeight,
									backgroundColor: baseColor,
									borderRadius: 2,
									boxShadow: `0 0 ${4 + normalized * 8}px ${glowColor}`,
									opacity: 0.8 + normalized * 0.2,
								}}
							/>
						);
					})}
				</div>

				{/* Typography Layer */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						color: "#ffffff",
						fontFamily: "'Inter', 'Montserrat', 'Helvetica Neue', Helvetica, set-sans, Arial, sans-serif",
					}}
				>
					<h1 style={{
						margin: 0,
						fontSize: 80,
						fontWeight: 800,
						lineHeight: 1,
						textTransform: "uppercase",
						textShadow: "0 4px 12px rgba(0,0,0,0.5)"
					}}>
						{artistName}
					</h1>
					<h2 style={{
						margin: 0,
						fontSize: 40,
						fontWeight: 400,
						marginTop: 8,
						textShadow: "0 2px 8px rgba(0,0,0,0.5)"
					}}>
						{trackName}
					</h2>
				</div>
			</div>

			{/* Loading State Overlay */}
			{audioData ? null : (
				<div
					style={{
						position: "absolute",
						bottom: 64,
						left: 64,
						padding: "16px 20px",
						border: "1px solid rgba(255,255,255,0.24)",
						borderRadius: 12,
						backgroundColor: "rgba(0,0,0,0.6)",
						color: "#e5e7eb",
						fontFamily: "sans-serif",
						fontSize: 20,
					}}
				>
					Loading audio analysis for {audioSrc}...
				</div>
			)}
		</AbsoluteFill>
	);
};
