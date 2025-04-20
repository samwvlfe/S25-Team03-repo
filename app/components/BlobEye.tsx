import React, {useEffect, useState, useRef} from 'react';

interface Position {
    x: number;
    y: number;
}

export function Eye() {
    const eyeRef = useRef<HTMLDivElement | null>(null);
    const [pupilPos, setPupilPos] = useState<Position>({x:0, y:0});

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const eye = eyeRef.current;
            if (!eye) return;

            const rect = eye.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            const angle = Math.atan2(dy, dx);
            const distance = Math.min(8, Math.hypot(dx, dy));

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            setPupilPos({x, y});
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={eyeRef} className="blob-eye">
            <div className="blob-pupil" style={{
                transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`
            }} />
        </div>
    )
}