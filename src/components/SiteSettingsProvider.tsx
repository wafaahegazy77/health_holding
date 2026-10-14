"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
    emptySiteSettings,
    type SiteSettingsData,
} from "@/lib/site-branding";

const SiteSettingsContext = createContext<SiteSettingsData>(emptySiteSettings());

export function SiteSettingsProvider({
    value,
    children,
}: {
    value: SiteSettingsData;
    children: ReactNode;
}) {
    return (
        <SiteSettingsContext.Provider value={value}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
