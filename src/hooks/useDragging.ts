import { useEffect, useRef, useState } from 'react';

const useDragging = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    function onMouseMove(e: any) {
        if (!isDragging) return;
        ref.current !== null &&
            setPos({
                x: e.x - ref.current.offsetWidth / 2,
                y: e.y - ref.current.offsetHeight / 2,
            });
        e.stopPropagation();
        e.preventDefault();
    }

    function onMouseUp(e: any) {
        setIsDragging(false);
        e.stopPropagation();
        e.preventDefault();
    }

    function onMouseDown(e: any) {
        if (e.button !== 0) return;
        setIsDragging(true);

        ref.current !== null &&
            setPos({
                x: e.x - ref.current.offsetWidth / 2,
                y: e.y - ref.current.offsetHeight / 2,
            });

        e.stopPropagation();
        e.preventDefault();
    }

    // When the element mounts, attach an mousedown listener
    useEffect(() => {
        ref.current !== null &&
            ref.current.addEventListener('mousedown', onMouseDown);

        return () => {
            ref.current !== null &&
                ref.current.removeEventListener('mousedown', onMouseDown);
        };
    }, [ref.current]);

    // Everytime the isDragging state changes, assign or remove
    // the corresponding mousemove and mouseup handlers
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('mousemove', onMouseMove);
        } else {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }
        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, [isDragging]);

    return [ref, pos.x, pos.y, isDragging];
};

export default useDragging;
