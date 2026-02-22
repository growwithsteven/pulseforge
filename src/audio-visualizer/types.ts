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
	barCount: number;
	baseColor: string;
	glowColor: string;
	minRadius: number;
	maxRadius: number;
	controls?: PulseForgeControls;
};
