export type PulseForgeControls = {
	energy: number;
	sensitivity: number;
	strobe: number;
	glitch: number;
	colorMotion: number;
};

export type PresetName = "calm" | "standard" | "club";

export type AudioVisualizerProps = {
	audioSrc: string;
	imageSrc: string;
	artistName: string;
	trackName: string;
	barCount: number;
	baseColor: string;
	glowColor: string;
	controls?: PulseForgeControls;
};
