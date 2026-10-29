import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const Strips = ({
    count = 40,
    action = "cover",
    onComplete,
}) => {
    const containerRef = useRef(null);
    const stripsRef = useRef([]);
    const onCompleteRef = useRef(onComplete);


    const stripColors = [
        "bg-red-800",
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-400",
        "bg-pink-500",
        "bg-zinc-900",
    ];

    useLayoutEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useLayoutEffect(() => {
        const strips = stripsRef.current.slice(0, count).filter(Boolean);
        if (!strips.length) return;

        const ctx = gsap.context(() => {
            const revealing = action === "reveal";

            // Randomize the order independently for each stage.
            const order = gsap.utils.shuffle([...strips.keys()]);

            gsap.set(strips, {
                xPercent: revealing ? 0 : -100,
            });

            const tl = gsap.timeline({
                onComplete: () => onCompleteRef.current?.(),
            });

            order.forEach((index) => {
                tl.to(strips[index], {
                    xPercent: revealing ? 100 : 0,
                    duration: 0.18,
                    ease: "power2.inOut",
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [count, action]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-9999 flex flex-col pointer-events-none"
        >
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        stripsRef.current[i] = el;
                    }}
                    className={`w-full flex-1 ${stripColors[i % stripColors.length]}`}
                />
            ))}
        </div>
    );
};

export default Strips;
