"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
    useEffect(() => {
        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const load = () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        };

        if (typeof window.requestIdleCallback === "function") {
            idleId = window.requestIdleCallback(load, { timeout: 2000 });
        } else {
            timeoutId = setTimeout(load, 1);
        }

        return () => {
            if (
                idleId !== undefined &&
                typeof window.cancelIdleCallback === "function"
            ) {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
    }, []);

    return null;
}
