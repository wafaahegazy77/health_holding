"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DnaInkScene = dynamic(() => import("./DnaInkScene"), {
    ssr: false,
    loading: () => (
        <div className="hero_scene hero_scene_fallback" aria-hidden="true" />
    ),
});

function canUseWebGL() {
    if (typeof window === "undefined") return false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
    }

    const connection = (
        navigator as Navigator & {
            connection?: { saveData?: boolean };
        }
    ).connection;

    if (connection?.saveData) return false;

    // Skip WebGL on mobile / touch-first devices (already visually muted in CSS).
    if (window.matchMedia("(max-width: 991px), (pointer: coarse)").matches) {
        return false;
    }

    return true;
}

export default function HeroVisual() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (!canUseWebGL()) return;

        let cancelled = false;
        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const enable = () => {
            if (!cancelled) setEnabled(true);
        };

        if (typeof window.requestIdleCallback === "function") {
            idleId = window.requestIdleCallback(enable, { timeout: 1500 });
        } else {
            timeoutId = setTimeout(enable, 200);
        }

        return () => {
            cancelled = true;
            if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
    }, []);

    if (!enabled) {
        return (
            <div className="hero_scene hero_scene_fallback" aria-hidden="true" />
        );
    }

    return <DnaInkScene />;
}
