import "./index.css";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { MyComposition } from "./Composition";
import { AudioVisualizer } from "./audio-visualizer/AudioVisualizer";
import type { AudioVisualizerProps } from "./audio-visualizer/types";

const AUDIO_VISUALIZER_FPS = 30;

const calculateAudioVisualizerMetadata: CalculateMetadataFunction<
	AudioVisualizerProps
> = async ({
	props,
}) => {
	try {
		const durationInSeconds = await getAudioDurationInSeconds(staticFile(props.audioSrc));
		return {
			durationInFrames: Math.max(
				1,
				Math.ceil(durationInSeconds * AUDIO_VISUALIZER_FPS),
			),
		};
	} catch (error) {
		console.warn("Could not read audio duration. Falling back to 600 frames.", error);
		return {
			durationInFrames: 600,
		};
	}
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="JournalSignal"
				component={MyComposition}
				durationInFrames={600}
				fps={AUDIO_VISUALIZER_FPS}
				width={1920}
				height={1080}
				defaultProps={{
					title: "From Noise to Clarity",
					subtitle: "Write Your Journal",
					ctaText: "One page a day.",
					accentColor: "#5EEAD4",
					showLogo: true,
					logoText: "JOURNAL",
				}}
			/>
			<Composition
				id="AudioVisualizer"
				component={AudioVisualizer}
				durationInFrames={600}
				fps={AUDIO_VISUALIZER_FPS}
				width={1920}
				height={1080}
				calculateMetadata={calculateAudioVisualizerMetadata}
				defaultProps={{
					audioSrc: "audio.mp3",
					barCount: 128,
					baseColor: "#7dd3fc",
					glowColor: "#22d3ee",
					minRadius: 180,
					maxRadius: 430,
				}}
			/>
		</>
	);
};
