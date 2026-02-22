import type { PresetName, PulseForgeControls } from "./types";

export const PULSEFORGE_PRESETS: Record<PresetName, PulseForgeControls> = {
	calm: {
		energy: 3,
		sensitivity: 4,
		strobe: 2,
		glitch: 2,
		colorMotion: 3,
	},
	standard: {
		energy: 5,
		sensitivity: 5,
		strobe: 5,
		glitch: 5,
		colorMotion: 5,
	},
	club: {
		energy: 8,
		sensitivity: 7,
		strobe: 8,
		glitch: 7,
		colorMotion: 8,
	},
};

export const DEFAULT_PULSEFORGE_CONTROLS: PulseForgeControls =
	PULSEFORGE_PRESETS.standard;
