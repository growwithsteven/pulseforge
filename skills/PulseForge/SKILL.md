---
name: PulseForge
description: >
  Create and run PulseForge audio-visualization renders with a strict input gate.

  BOOTSTRAP MODE - Triggers: "Create a PulseForge video", "Set up PulseForge",
  "Generate an audio visualizer", "Render MP3 with PulseForge"
  -> Verifies audio source, collects 5 required control values (1-10),
  validates inputs, and runs Remotion render.

  ITERATION MODE - Triggers: "Tune PulseForge style", "Adjust PulseForge controls",
  "Update preset behavior", "Improve visual intensity"
  -> Loads existing settings, asks targeted control adjustments,
  rerenders with updated values, and summarizes differences.

  Use when users want a CLI-first plugin workflow for Remotion-based audio visualization,
  with explicit user-defined control values before render starts.
---

# PulseForge

A plugin-style skill for generating MP4 audio visualizations from audio files using Remotion,
with mandatory control input and validation before rendering.

## How It Works

This skill has two modes:

1. **Bootstrap Mode**: First-time or fresh render request.
2. **Iteration Mode**: Adjust existing style/intensity and rerender.

---

## Bootstrap Mode

Use when: User wants to render a new PulseForge output from an audio file.

### Phase 1: Input and File Validation

**Step 1: Confirm required audio path**

Require `--audio <path>` and verify the file exists.

Example:

```bash
npm run pulseforge:generate -- --audio public/Froggy!.mp3 --out out/froggy-pulseforge.mp4
```

If the audio file is outside `public/`, copy it into `public/.vj-imports/` and use the copied path for rendering.

**Step 2: Confirm optional render settings**

- `--out` is optional; default to `out/audio-visualizer.mp4`
- `--preset` is optional; default to `standard`
- Valid presets: `calm`, `standard`, `club`

### Phase 2: Mandatory Control Gate

Before render, ask user to define all five values as integers `1..10`:

1. `Energy`
2. `Sensitivity`
3. `Strobe`
4. `Glitch`
5. `Color Motion`

Validation rules:

- Empty input -> reject
- Non-integer input -> reject
- Out of range (<1 or >10) -> reject
- Do not start rendering until all values pass

### Phase 3: Render Execution

After successful validation:

1. Build Remotion props with user controls
2. Run render for composition `AudioVisualizer`
3. Stream logs and return output path

Command pattern used internally:

```bash
npx remotion render AudioVisualizer <out-path> --props '<json>'
```

### Phase 4: Result Summary

Return:

- Chosen preset
- Final five control values
- Resolved audio source path
- Output path
- Success/failure status

---

## Iteration Mode

Use when: User already rendered once and wants a modified visual result.

### Step 1: Load Prior Settings

Collect previous values from user or prior run output:

- audio path
- preset
- five control values
- output path

### Step 2: Ask Targeted Adjustments

Ask only what needs change:

- "Increase energy?"
- "Reduce strobe intensity?"
- "Make color motion slower/faster?"

Still enforce `1..10` integer validation.

### Step 3: Rerender

Run PulseForge again with updated controls.

### Step 4: Compare and Explain

Summarize what changed and expected visual differences:

- energy up -> stronger bar movement
- sensitivity up -> more micro-audio reaction
- strobe up -> stronger/more frequent flashes (capped)
- glitch up -> more displacement/scanline behavior
- color motion up -> faster hue drift

---

## Control Reference

### Energy (1-10)
Controls overall visual intensity and amplitude scaling.

### Sensitivity (1-10)
Controls FFT response to quieter frequency content.

### Strobe (1-10)
Controls flash strength. Runtime must cap flash frequency (max 4/sec).

### Glitch (1-10)
Controls transform distortion and overlay artifact amount.

### Color Motion (1-10)
Controls hue rotation speed and color movement.

---

## Operational Defaults

- Composition: `AudioVisualizer`
- FPS: `30`
- Resolution: `1920x1080`
- Default preset: `standard`
- Default output: `out/audio-visualizer.mp4`

---

## Quality Checklist

Before delivering output, verify:

- [ ] Audio path exists and is readable
- [ ] Preset is valid (`calm|standard|club`)
- [ ] All five controls are integers in `1..10`
- [ ] Render does not start before successful validation
- [ ] Output file is generated at requested/default location
- [ ] User gets a final summary of effective settings
