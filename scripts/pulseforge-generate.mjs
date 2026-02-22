#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const PRESETS = {
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

const CONTROL_LABELS = [
	{ key: "energy", label: "Energy" },
	{ key: "sensitivity", label: "Sensitivity" },
	{ key: "strobe", label: "Strobe" },
	{ key: "glitch", label: "Glitch" },
	{ key: "colorMotion", label: "Color Motion" },
];

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(projectRoot, "public");

const parseArgs = (argv) => {
	const args = {};
	for (let i = 0; i < argv.length; i++) {
		const token = argv[i];
		if (!token.startsWith("--")) {
			continue;
		}

		const key = token.slice(2);
		const value = argv[i + 1];
		if (!value || value.startsWith("--")) {
			args[key] = true;
			continue;
		}

		args[key] = value;
		i += 1;
	}

	return args;
};

const isInside = (parent, child) => {
	const rel = path.relative(parent, child);
	return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
};

const toPosixPath = (value) => value.split(path.sep).join("/");

const resolveAudioPath = async (rawAudioPath) => {
	const resolvedInput = path.isAbsolute(rawAudioPath)
		? path.normalize(rawAudioPath)
		: path.resolve(projectRoot, rawAudioPath);

	try {
		await fs.access(resolvedInput);
	} catch {
		throw new Error(`Audio file not found: ${resolvedInput}`);
	}

	return resolvedInput;
};

const ensureAudioInPublic = async (resolvedInput) => {

	if (isInside(publicDir, resolvedInput)) {
		return toPosixPath(path.relative(publicDir, resolvedInput));
	}

	const importsDir = path.join(publicDir, ".vj-imports");
	await fs.mkdir(importsDir, { recursive: true });

	const ext = path.extname(resolvedInput) || ".mp3";
	const base = path.basename(resolvedInput, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
	const targetName = `${Date.now()}-${base}${ext}`;
	const targetPath = path.join(importsDir, targetName);
	await fs.copyFile(resolvedInput, targetPath);

	return toPosixPath(path.relative(publicDir, targetPath));
};

const askPreset = async (rl, presetFromArg) => {
	if (presetFromArg) {
		const value = presetFromArg.toLowerCase();
		if (!Object.hasOwn(PRESETS, value)) {
			throw new Error(`Invalid preset "${presetFromArg}". Use calm, standard, or club.`);
		}
		return value;
	}

	while (true) {
		const answer = await rl.question(
			'Preset [calm | standard | club] (default: standard): ',
		);
		if (answer.trim() === "") {
			return "standard";
		}

		const lower = answer.trim().toLowerCase();
		if (Object.hasOwn(PRESETS, lower)) {
			return lower;
		}

		process.stdout.write("Invalid preset. Choose calm, standard, or club.\n");
	}
};

const parseControlValue = (input) => {
	if (input.trim() === "") {
		return { ok: false, reason: "Value cannot be empty." };
	}

	const parsed = Number(input);
	if (!Number.isInteger(parsed)) {
		return { ok: false, reason: "Value must be an integer." };
	}

	if (parsed < 1 || parsed > 10) {
		return { ok: false, reason: "Value must be between 1 and 10." };
	}

	return { ok: true, value: parsed };
};

const askControls = async (rl, presetName) => {
	const controls = {};
	const preset = PRESETS[presetName];

	for (const { key, label } of CONTROL_LABELS) {
		while (true) {
			const suggestion = preset[key];
			const answer = await rl.question(`${label} (1-10) [preset ${suggestion}]: `);
			const parsed = parseControlValue(answer);
			if (!parsed.ok) {
				process.stdout.write(`${parsed.reason}\n`);
				continue;
			}

			controls[key] = parsed.value;
			break;
		}
	}

	return controls;
};

const runRender = ({ outPath, propsJson }) => {
	return new Promise((resolve, reject) => {
		const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
		const child = spawn(
			npxCommand,
			["remotion", "render", "AudioVisualizer", outPath, "--props", propsJson],
			{
				cwd: projectRoot,
				stdio: "inherit",
			},
		);

		child.on("exit", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`Render failed with exit code ${code ?? "unknown"}.`));
		});

		child.on("error", (error) => {
			reject(error);
		});
	});
};

const main = async () => {
	const args = parseArgs(process.argv.slice(2));
	if (!args.audio || typeof args.audio !== "string") {
		throw new Error(
			'Missing required argument --audio. Example: npm run pulseforge:generate -- --audio public/audio.mp3',
		);
	}

	const outPath = typeof args.out === "string" ? args.out : "out/audio-visualizer.mp4";
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	try {
		process.stdout.write("PulseForge generator\n\n");
		const resolvedAudioPath = await resolveAudioPath(args.audio);
		const preset = await askPreset(rl, typeof args.preset === "string" ? args.preset : null);
		const controls = await askControls(rl, preset);
		const audioSrc = await ensureAudioInPublic(resolvedAudioPath);

		const props = {
			audioSrc,
			controls,
		};

		process.stdout.write("\nFinal render settings:\n");
		process.stdout.write(`- preset: ${preset}\n`);
		process.stdout.write(`- audioSrc: ${audioSrc}\n`);
		process.stdout.write(`- out: ${outPath}\n`);
		for (const { key, label } of CONTROL_LABELS) {
			process.stdout.write(`- ${label}: ${controls[key]}\n`);
		}
		process.stdout.write("\nStarting Remotion render...\n\n");

		await runRender({
			outPath,
			propsJson: JSON.stringify(props),
		});

		process.stdout.write(`\nRender complete: ${outPath}\n`);
	} finally {
		rl.close();
	}
};

main().catch((error) => {
	process.stderr.write(`Error: ${error.message}\n`);
	process.exit(1);
});
