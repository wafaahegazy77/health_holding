"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => {
    return useContext(LenisContext);
};

export default function LenisProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) =>
                Math.min(
                    1,
                    1.001 - Math.pow(2, -10 * t)
                ),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        lenisInstance.on(
            "scroll",
            ScrollTrigger.update
        );

        function update(time: number) {
            lenisInstance.raf(time * 1000);
        }

        gsap.ticker.add(update);

        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
            lenisInstance.destroy();
            setLenis(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
}