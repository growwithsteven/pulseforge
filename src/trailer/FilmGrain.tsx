import React from 'react';
import { AbsoluteFill, random } from 'remotion';

export const FilmGrain: React.FC = () => {
    return (
        <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
            <div
                className="film-flicker"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.15,
                    background: `url('https://www.transparenttextures.com/patterns/stardust.png')`,
                    filter: 'contrast(150%) brightness(150%)',
                }}
            />
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${random(i + 100) * 100}%`,
                        top: 0,
                        width: '1px',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        opacity: random(i + 200) > 0.8 ? 0.3 : 0,
                        transform: `translateX(${random(i + 300) * 2 - 1}px)`,
                    }}
                />
            ))}
        </AbsoluteFill>
    );
};
