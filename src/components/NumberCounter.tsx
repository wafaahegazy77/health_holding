"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

type NumberCounterProps = {
    value: number;
    delay?: number;
};

export default function NumberCounter({
    value,
    delay = 0,
}: NumberCounterProps) {
    const [count, setCount] = useState(0);

    const ref = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const element = ref.current;

        if (!element || hasStarted.current) return;

        let timer: ReturnType<typeof setTimeout> | undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    !hasStarted.current
                ) {
                    hasStarted.current = true;

                    timer = setTimeout(() => {
                        setCount(value);
                    }, delay);

                    observer.disconnect();
                }
            },
            {
                threshold: 0.3,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [value, delay]);

    return (
        <div ref={ref}>
            <NumberFlow
                value={count}
                spinTiming={{
                    duration: 500,
                }}
                transformTiming={{
                    duration: 500,
                }}
            />
        </div>
    );
}