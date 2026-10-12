"use client";

import { useEffect } from "react";

const STYLESHEET_ID = "fa-stylesheet";
const STYLESHEET_HREF = "/styles/all.min.css";

export default function DeferredFontAwesome() {
    useEffect(() => {
        if (document.getElementById(STYLESHEET_ID)) return;

        const load = () => {
            if (document.getElementById(STYLESHEET_ID)) return;

            const link = document.createElement("link");
            link.id = STYLESHEET_ID;
            link.rel = "stylesheet";
            link.href = STYLESHEET_HREF;
            document.head.appendChild(link);
        };

        if (typeof window.requestIdleCallback === "function") {
            const idleId = window.requestIdleCallback(load, { timeout: 1200 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = window.setTimeout(load, 1);
        return () => window.clearTimeout(timeoutId);
    }, []);

    return null;
}
