import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const IntroScreen: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 5, 45, 60], [0, 1, 1, 0]);

    return (
        <AbsoluteFill className="bg-[#004d26] items-center justify-center p-20" style={{ opacity }}>
            <div className="border-8 border-white p-12 text-center max-w-4xl">
                <h2 className="text-white text-6xl font-black mb-8 border-b-4 border-white pb-4">
                    RESTRICTED
                </h2>
                <p className="text-white text-3xl font-bold leading-relaxed tracking-wider">
                    THE FOLLOWING PREVIEW HAS BEEN APPROVED FOR
                    <br />
                    <span className="text-7xl block my-6 font-black">BADASS AUDIENCES</span>
                    BY THE B-MOVIE FILM ASSOCIATION OF ANTIGRAVITY
                </p>
                <div className="mt-10 border-t-4 border-white pt-6">
                    <p className="text-white text-xl">GRATUITOUS COOLNESS, EXPLOSIONS, AND CHEESY DIALOGUE</p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
