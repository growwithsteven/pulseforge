import React from "react";
import {
	AbsoluteFill,
	Easing,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

type MyCompositionProps = {
	title: string;
	subtitle: string;
	ctaText: string;
	accentColor: string;
	showLogo: boolean;
	logoText: string;
};

const NOISE_WORDS = [
	"tasks",
	"doubt",
	"ideas",
	"notifications",
	"unfinished",
	"later",
	"meetings",
	"tabs",
	"pressure",
	"what if",
	"deadlines",
];

const JOURNAL_PROMPTS = [
	"What happened?",
	"What matters now?",
	"What will I do next?",
];

const sceneOpacity = (frame: number, duration: number) => {
	return interpolate(
		frame,
		[0, 12, duration - 18, duration],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
};

const NoiseScene: React.FC<{accentColor: string}> = ({ accentColor }) => {
	const frame = useCurrentFrame();
	const { width } = useVideoConfig();
	const opacity = sceneOpacity(frame, 150);

	return (
		<AbsoluteFill style={{ opacity }}>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 20% 20%, #252331 0%, #0b0b12 55%, #050507 100%)",
				}}
			/>
			{NOISE_WORDS.map((word, index) => {
				const baseX = (index % 4) * (width / 4) + 120;
				const baseY = Math.floor(index / 4) * 240 + 180;
				const driftX = Math.sin((frame + index * 13) * 0.08) * (34 + index * 2);
				const driftY = Math.cos((frame + index * 11) * 0.07) * (20 + index);
				const rotate = Math.sin((frame + index * 17) * 0.05) * 8;
				const wordOpacity = interpolate(frame, [0, 90, 150], [0.35, 0.85, 0.2], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});

				return (
					<div
						key={word}
						style={{
							position: "absolute",
							left: baseX + driftX,
							top: baseY + driftY,
							color: index % 3 === 0 ? accentColor : "rgba(255,255,255,0.78)",
							fontFamily: "Arial Black, Impact, sans-serif",
							fontSize: 52 - (index % 3) * 8,
							letterSpacing: 1,
							textTransform: "uppercase",
							opacity: wordOpacity,
							transform: `rotate(${rotate}deg)`,
							filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))",
						}}
					>
						{word}
					</div>
				);
			})}

			<div
				style={{
					position: "absolute",
					bottom: 92,
					left: 120,
					color: "rgba(255,255,255,0.92)",
					fontFamily: "Inter, system-ui, sans-serif",
					fontSize: 38,
					fontWeight: 600,
					letterSpacing: 0.4,
				}}
			>
				Too many thoughts. Too little clarity.
			</div>
		</AbsoluteFill>
	);
};

const PauseScene: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = sceneOpacity(frame, 90);
	const lineScale = spring({
		fps: 30,
		frame,
		config: { damping: 16, stiffness: 110 },
	});
	const cursorOpacity = frame % 24 < 12 ? 1 : 0.2;

	return (
		<AbsoluteFill
			style={{
				opacity,
				background:
					"radial-gradient(circle at 50% 40%, #1d2330 0%, #0b1019 50%, #06080f 100%)",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					width: 1060,
					height: 2,
					backgroundColor: "rgba(255,255,255,0.8)",
					transform: `scaleX(${lineScale})`,
					transformOrigin: "left center",
				}}
			/>
			<div
				style={{
					marginTop: 40,
					fontFamily: "Georgia, Times New Roman, serif",
					fontSize: 84,
					color: "#E5E7EB",
					letterSpacing: 3,
				}}
			>
				Pause
				<span style={{ opacity: cursorOpacity, marginLeft: 12 }}>|</span>
			</div>
		</AbsoluteFill>
	);
};

const WriteScene: React.FC<{accentColor: string}> = ({ accentColor }) => {
	const frame = useCurrentFrame();
	const opacity = sceneOpacity(frame, 180);

	return (
		<AbsoluteFill
			style={{
				opacity,
				background:
					"linear-gradient(165deg, #0a1220 0%, #0f1728 50%, #0d1f2f 100%)",
				padding: "140px 170px",
			}}
		>
			<div
				style={{
					color: "rgba(255,255,255,0.9)",
					fontFamily: "Inter, system-ui, sans-serif",
					fontSize: 32,
					fontWeight: 500,
					marginBottom: 56,
					letterSpacing: 1.2,
					textTransform: "uppercase",
				}}
			>
				Write your journal.
			</div>

			{JOURNAL_PROMPTS.map((line, index) => {
				const lineStart = index * 42 + 10;
				const reveal = interpolate(frame, [lineStart, lineStart + 30], [0, line.length], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: Easing.out(Easing.cubic),
				});
				const text = line.slice(0, Math.floor(reveal));
				const lineOpacity = interpolate(frame, [lineStart - 6, lineStart + 12], [0.3, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});

				return (
					<div key={line} style={{ marginBottom: 48, opacity: lineOpacity }}>
						<div
							style={{
								fontFamily: "Georgia, Times New Roman, serif",
								fontSize: 68,
								color: "#F8FAFC",
								lineHeight: 1.1,
								minHeight: 78,
							}}
						>
							{text}
						</div>
						<div
							style={{
								marginTop: 10,
								height: 2,
								width: `${Math.max(24, Math.min(95, (text.length / line.length) * 100))}%`,
								backgroundColor: accentColor,
							}}
						/>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const ClarityScene: React.FC<MyCompositionProps> = ({
	title,
	subtitle,
	ctaText,
	accentColor,
	showLogo,
	logoText,
}) => {
	const frame = useCurrentFrame();
	const opacity = sceneOpacity(frame, 180);
	const lift = spring({
		fps: 30,
		frame,
		config: { damping: 14, stiffness: 95, mass: 0.8 },
	});
	const maskReveal = interpolate(frame, [10, 76], [0, 100], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				opacity,
				background:
					"radial-gradient(circle at 50% 20%, #123247 0%, #0b1726 45%, #050a12 100%)",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					textAlign: "center",
					transform: `translateY(${interpolate(lift, [0, 1], [30, 0])}px) scale(${interpolate(
						lift,
						[0, 1],
						[0.94, 1],
					)})`,
				}}
			>
				<div
					style={{
						display: "inline-block",
						overflow: "hidden",
						clipPath: `inset(0 ${100 - maskReveal}% 0 0)`,
					}}
				>
					<h1
						style={{
							margin: 0,
							fontFamily: "Arial Black, Impact, sans-serif",
							fontSize: 128,
							letterSpacing: 2,
							color: "#F8FAFC",
							textTransform: "uppercase",
							lineHeight: 0.98,
						}}
					>
						{title}
					</h1>
				</div>
				<p
					style={{
						margin: "28px 0 0",
						fontFamily: "Inter, system-ui, sans-serif",
						fontSize: 58,
						fontWeight: 500,
						color: accentColor,
						letterSpacing: 1.4,
						textTransform: "uppercase",
					}}
				>
					{subtitle}
				</p>
				<p
					style={{
						margin: "28px 0 0",
						fontFamily: "Inter, system-ui, sans-serif",
						fontSize: 36,
						color: "rgba(255,255,255,0.88)",
						letterSpacing: 0.8,
					}}
				>
					{ctaText}
				</p>

				{showLogo ? (
					<div
						style={{
							marginTop: 56,
							display: "inline-flex",
							alignItems: "center",
							gap: 16,
							padding: "12px 22px",
							border: `1px solid ${accentColor}`,
							borderRadius: 999,
							fontFamily: "Inter, system-ui, sans-serif",
							fontSize: 24,
							fontWeight: 600,
							color: "#E2E8F0",
							letterSpacing: 1.2,
						}}
					>
						<div
							style={{
								width: 14,
								height: 14,
								borderRadius: "50%",
								backgroundColor: accentColor,
							}}
						/>
						{logoText}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const GrainOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const grainOpacity = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.05, 0.12]);

	return (
		<AbsoluteFill style={{ pointerEvents: "none" }}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: grainOpacity,
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.35) 0.6px, transparent 0.6px), radial-gradient(rgba(255,255,255,0.2) 0.6px, transparent 0.6px)",
					backgroundSize: "3px 3px, 4px 4px",
					backgroundPosition: "0 0, 2px 1px",
					mixBlendMode: "screen",
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.28) 100%)",
				}}
			/>
		</AbsoluteFill>
	);
};

export const MyComposition: React.FC<MyCompositionProps> = (props) => {
	return (
		<AbsoluteFill>
			<Sequence durationInFrames={150}>
				<NoiseScene accentColor={props.accentColor} />
			</Sequence>
			<Sequence from={150} durationInFrames={90}>
				<PauseScene />
			</Sequence>
			<Sequence from={240} durationInFrames={180}>
				<WriteScene accentColor={props.accentColor} />
			</Sequence>
			<Sequence from={420} durationInFrames={180}>
				<ClarityScene {...props} />
			</Sequence>
			<GrainOverlay />
		</AbsoluteFill>
	);
};
