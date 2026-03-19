import {
	AbsoluteFill,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import React from "react";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// Best Practice: Type-safe font loading
const { fontFamily: outfitFont } = loadOutfit("normal", {
	weights: ["700"],
	subsets: ["latin"],
});
const { fontFamily: interFont } = loadInter("normal", {
	weights: ["400"],
	subsets: ["latin"],
});

const COLORS = {
	pokemonBlue: "#3B4CCA",
	pikachuYellow: "#FFDE00",
	islandTurquoise: "#40E0D0",
	white: "#FFFFFF",
};

const Title: React.FC<{ text: string; delay: number; color?: string }> = ({
	text,
	delay,
	color = COLORS.pikachuYellow,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Best Practice: Spring animation using useCurrentFrame
	const spr = spring({
		frame: frame - delay,
		fps,
		config: { stiffness: 100, damping: 10 },
	});

	const opacity = spr;
	const y = interpolate(spr, [0, 1], [50, 0]);
	const scale = interpolate(spr, [0, 1], [0.8, 1]);

	return (
		<h1
			style={{
				fontFamily: outfitFont,
				fontSize: 100,
				color,
				textAlign: "center",
				opacity,
				transform: `translateY(${y}px) scale(${scale})`,
				textShadow: "0 10px 40px rgba(0,0,0,0.6)",
				margin: 0,
				fontWeight: "bold",
				position: "relative",
				zIndex: 2,
			}}
		>
			{text}
		</h1>
	);
};

const Subtitle: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const spr = spring({
		frame: frame - delay,
		fps,
		config: { stiffness: 100, damping: 12 },
	});

	return (
		<div
			style={{
				fontFamily: interFont,
				fontSize: 42,
				color: COLORS.white,
				textAlign: "center",
				maxWidth: 1200,
				lineHeight: 1.6,
				opacity: spr,
				marginTop: 60,
				textShadow: "0 5px 20px rgba(0,0,0,0.4)",
				position: "relative",
				zIndex: 2,
				backgroundColor: "rgba(0,0,0,0.3)",
				padding: "20px 40px",
				borderRadius: 20,
				backdropFilter: "blur(5px)",
			}}
		>
			{text}
		</div>
	);
};

const BackgroundImage: React.FC<{ src: string; animateScale?: boolean }> = ({ src, animateScale = true }) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// Best Practice: Ken Burns effect using interpolate
	const scale = animateScale 
		? interpolate(frame, [0, durationInFrames], [1, 1.2], { extrapolateRight: "clamp" }) 
		: 1;

	return (
		<AbsoluteFill style={{ overflow: "hidden" }}>
			<Img
				src={src}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					transform: `scale(${scale})`,
					filter: "brightness(0.6) saturate(1.2)",
				}}
			/>
		</AbsoluteFill>
	);
};

export const PokemonFutureVisions: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			{/* Scene 1: Intro (0-5s) */}
			<Sequence from={0} durationInFrames={5 * fps}>
				<BackgroundImage src="https://images.unsplash.com/photo-1613771404721-1f92d799e49f?q=80&w=1920&h=1080&auto=format&fit=crop" />
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<Title text="FUTURE VISIONS" delay={fps * 0.5} />
					<Subtitle
						text="As the 30th Anniversary approaches, the world of Pokémon is evolving faster than ever."
						delay={fps * 1.5}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* Scene 2: Legends Z-A (5-20s) */}
			<Sequence from={5 * fps} durationInFrames={15 * fps}>
				<BackgroundImage src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&h=1080&auto=format&fit=crop" />
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100 }}>
					<Title text="POKÉMON LEGENDS: Z-A" delay={5 * fps + fps * 0.5} />
					<Subtitle
						text="Step into the urban redevelopment of Lumiose City. A dense, vertical adventure where Mega Evolution returns to challenge the legacy."
						delay={5 * fps + fps * 1.5}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* Scene 3: Gen 10 (20-40s) */}
			<Sequence from={20 * fps} durationInFrames={20 * fps}>
				<BackgroundImage src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1920&h=1080&auto=format&fit=crop" />
				{/* Sea Mist Overlay */}
				<AbsoluteFill
					style={{
						background: `linear-gradient(to bottom, ${COLORS.islandTurquoise}33, transparent 40%, ${COLORS.pokemonBlue}22)`,
						pointerEvents: "none",
						zIndex: 1,
					}}
				/>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100 }}>
					<Title text="GENERATION 10" delay={20 * fps + fps * 0.5} color={COLORS.islandTurquoise} />
					<Subtitle
						text="Rumored 'Winds and Waves'—a vast tropical archipelago. Powered by Engine X for a visual leap beyond boundaries."
						delay={20 * fps + fps * 1.5}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* Scene 4: Outro (40-50s) */}
			<Sequence from={40 * fps}>
				<AbsoluteFill style={{ backgroundColor: COLORS.pokemonBlue }}>
					<AbsoluteFill
						style={{
							background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
							zIndex: 0,
						}}
					/>
					<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 1 }}>
						<Title text="THE JOURNEY BEGINS" delay={40 * fps + fps * 0.5} />
						<Subtitle
							text="Will you ride the winds, or master the waves? The next 30 years starts with your choice."
							delay={40 * fps + fps * 1.5}
						/>
					</AbsoluteFill>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
