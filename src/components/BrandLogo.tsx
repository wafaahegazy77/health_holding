"use client";

import Image from "next/image";

import { useSiteSettings } from "@/components/SiteSettingsProvider";

type BrandLogoProps = {
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    alt?: string;
};

export default function BrandLogo({
    width,
    height,
    className,
    priority = false,
    alt = "Health Holding",
}: BrandLogoProps) {
    const { logo } = useSiteSettings();

    return (
        <Image
            src={logo}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
        />
    );
}
