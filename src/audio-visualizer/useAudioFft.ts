import { visualizeAudio } from "@remotion/media-utils";
import { useMemo, useRef } from "react";
import type { MediaUtilsAudioData } from "@remotion/media-utils";
import { clamp, lerp } from "./math";

type UseAudioFftOptions = {
	audioData: MediaUtilsAudioData | null;
	frame: number;
	fps: number;
	numberOfSamples: number;
	smoothingFactor?: number;
};

export const useAudioFft = ({
	audioData,
	frame,
	fps,
	numberOfSamples,
	smoothingFactor = 0.42,
}: UseAudioFftOptions): number[] => {
	const previous = useRef<Float32Array | null>(null);

	return useMemo(() => {
		if (!audioData) {
			previous.current = null;
			return new Array(numberOfSamples).fill(0);
		}

		const raw = visualizeAudio({
			audioData,
			frame,
			fps,
			numberOfSamples,
			smoothing: false,
			optimizeFor: "speed",
		});

		if (!previous.current || previous.current.length !== numberOfSamples) {
			previous.current = new Float32Array(numberOfSamples);
		}

		for (let i = 0; i < numberOfSamples; i++) {
			const current = Math.sqrt(clamp(raw[i] ?? 0, 0, 1));
			previous.current[i] = lerp(previous.current[i], current, smoothingFactor);
		}

		return Array.from(previous.current);
	}, [audioData, frame, fps, numberOfSamples, smoothingFactor]);
};
