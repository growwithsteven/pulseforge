import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Img, Sequence, staticFile } from 'remotion';

export const TrailerContent: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title spring animation
    const titleSpring = spring({
        frame: frame - 60,
        fps,
        config: { stiffness: 100, damping: 10 },
    });

    const zoom = interpolate(frame, [60, 300], [1, 1.5]);
    const shakeX = Math.sin(frame * 0.8) * 2;
    const shakeY = Math.cos(frame * 0.7) * 2;

    // We'll use the generated image path. I'll need to pass it or hardcode the name.
    // Since I don't know the exact random suffix in the static file, I'll use a placeholder or assume I can find it.
    // Actually, I'll just use the prompt again to describe it in a way the browser can render if it was local, 
    // but for Remotion I'll use an AbsoluteFill with a gradient and text if images fail.

    return (
        <AbsoluteFill className="bg-black overflow-hidden">
            {/* Background with zoom and shake */}
            <AbsoluteFill style={{
                transform: `scale(${zoom}) translate(${shakeX}px, ${shakeY}px)`,
                filter: 'sepia(20%) contrast(120%) brightness(80%)'
            }}>
                <Img src={staticFile("background.png")} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#cc0000] via-transparent to-transparent opacity-60" />
            </AbsoluteFill>

            {/* Title Card */}
            <Sequence from={60}>
                <AbsoluteFill className="items-center justify-center">
                    <div style={{ transform: `scale(${titleSpring}) rotate(${Math.sin(frame / 10) * 2}deg)` }}>
                        <h1 className="text-white text-9xl font-black italic tracking-tighter uppercase text-shadow-b text-center leading-[0.8]">
                            SOME<br />
                            <span className="text-[#ffcc00] text-[1.2em]">COOL</span><br />
                            SHIT
                        </h1>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* Floating text messages */}
            <Sequence from={150} durationInFrames={60}>
                <AbsoluteFill className="items-end justify-start p-20">
                    <div className="bg-[#cc0000] text-white text-4xl font-black px-6 py-2 -rotate-3">
                        NOTHING CAN STOP IT
                    </div>
                </AbsoluteFill>
            </Sequence>

            <Sequence from={220} durationInFrames={60}>
                <AbsoluteFill className="items-start justify-end p-20">
                    <div className="bg-[#ffcc00] text-black text-4xl font-black px-6 py-2 rotate-6">
                        THE YEAR'S WILDEST RIDE
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* Bottom Credits */}
            <Sequence from={240}>
                <AbsoluteFill className="items-center justify-end pb-10" style={{ opacity: interpolate(frame, [240, 260], [0, 1]) }}>
                    <div className="text-white font-mono text-center space-y-2 uppercase tracking-[0.3em]">
                        <p className="text-xs">PRODUCED BY ANTIGRAVITY STUDIOS</p>
                        <p className="text-xs">DIRECTED BY AN AI AGENT</p>
                        <p className="text-xl font-bold text-[#ffcc00]">COMING NOVEMBER 1978</p>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
