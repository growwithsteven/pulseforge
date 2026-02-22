import { clamp } from "./math";
import type { PulseForgeControls } from "./types";

type DerivedEffectParams = {
	energyGain: number;
	fftGamma: number;
	strobeStrength: number;
	maxStrobesPerSecond: number;
	glitchAmount: number;
	hueShiftSpeedDegPerSec: number;
	noiseFloor: number;
	ceiling: number;
};

const toUnitRange = (value: number): number => {
	return clamp((value - 1) / 9, 0, 1);
};

export const deriveEffectParams = (
	controls: PulseForgeControls,
): DerivedEffectParams => {
	const energyUnit = toUnitRange(controls.energy);
	const sensitivityUnit = toUnitRange(controls.sensitivity);
	const strobeUnit = toUnitRange(controls.strobe);
	const glitchUnit = toUnitRange(controls.glitch);
	const colorUnit = toUnitRange(controls.colorMotion);

	return {
		energyGain: 0.7 + energyUnit * 1.3,
		fftGamma: 1.8 - sensitivityUnit * 1.1,
		strobeStrength: strobeUnit,
		maxStrobesPerSecond: 4,
		glitchAmount: glitchUnit,
		hueShiftSpeedDegPerSec: colorUnit * 80,
		noiseFloor: 0.01 + sensitivityUnit * 0.06,
		ceiling: 0.7 + sensitivityUnit * 0.3,
	};
};
