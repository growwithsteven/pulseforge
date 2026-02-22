import { Audio } from "@remotion/media";
import { useAudioData } from "@remotion/media-utils";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { average, clamp } from "./math";
import type { AudioVisualizerProps } from "./types";
import { useAudioFft } from "./useAudioFft";

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
	audioSrc,
	barCount,
	baseColor,
	glowColor,
	minRadius,
	maxRadius,
}) => {
	const frame = useCurrentFrame();
	const { width, height, fps } = useVideoConfig();
	const resolvedSrc = staticFile(audioSrc);
	const audioData = useAudioData(resolvedSrc);
	const bars = useAudioFft({
		audioData,
		frame,
		fps,
		numberOfSamples: barCount,
	});

	const centerX = width / 2;
	const centerY = height / 2;
	const barWidth = 8;
	const lowEnd = average(bars.slice(0, Math.max(8, Math.floor(barCount * 0.08))));
	const pulse = 1 + lowEnd * 0.06;

	return (
		<AbsoluteFill
			style={{
				background:
					"radial-gradient(circle at 50% 35%, #0f2b3b 0%, #091722 46%, #04070f 100%)",
				overflow: "hidden",
			}}
		>
			<Audio src={resolvedSrc} />
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `scale(${pulse})`,
				}}
			>
				{bars.map((sample, i) => {
					const angle = (i / barCount) * Math.PI * 2;
					const normalized = clamp(sample, 0, 1);
					const barLength = Math.max(6, normalized * (maxRadius - minRadius));
					const radius = minRadius + barLength / 2;
					const x = centerX + Math.cos(angle) * radius;
					const y = centerY + Math.sin(angle) * radius;
					const deg = (angle * 180) / Math.PI + 90;
					const opacity = 0.28 + normalized * 0.72;

					return (
						<div
							key={i}
							style={{
								position: "absolute",
								left: x - barWidth / 2,
								top: y - barLength / 2,
								width: barWidth,
								height: barLength,
								background: `linear-gradient(to top, ${baseColor}, ${glowColor})`,
								borderRadius: 999,
								transform: `rotate(${deg}deg)`,
								opacity,
								boxShadow: `0 0 ${8 + normalized * 14}px ${glowColor}`,
							}}
						/>
					);
				})}
			</div>

			<div
				style={{
					position: "absolute",
					left: centerX - 126,
					top: centerY - 126,
					width: 252,
					height: 252,
					borderRadius: "50%",
					background: `radial-gradient(circle, ${glowColor}66 0%, ${glowColor}18 45%, transparent 70%)`,
					filter: "blur(2px)",
				}}
			/>

			{audioData ? null : (
				<div
					style={{
						position: "absolute",
						bottom: 64,
						left: 64,
						right: 64,
						padding: "16px 20px",
						border: "1px solid rgba(255,255,255,0.24)",
						borderRadius: 12,
						backgroundColor: "rgba(0,0,0,0.36)",
						color: "#e5e7eb",
						fontFamily: "Arial, sans-serif",
						fontSize: 26,
						letterSpacing: 0.3,
					}}
				>
					Loading audio analysis for {audioSrc}. If this persists, ensure the file exists in
					public/.
				</div>
			)}
		</AbsoluteFill>
	);
};
