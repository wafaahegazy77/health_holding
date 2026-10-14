/** Turns API codes like `private_hospitals` into `Private hospitals`. */
export function formatLookupLabel(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // Already human-readable (has spaces / mixed punctuation)
    if (/[\s-]/.test(trimmed) && !/^[a-z0-9_]+$/i.test(trimmed)) {
        return trimmed;
    }

    if (!trimmed.includes("_") && !/^[a-z]+$/i.test(trimmed)) {
        return trimmed;
    }

    const words = trimmed
        .split(/[_-]+/)
        .filter(Boolean)
        .map((word) => word.toLowerCase());

    if (words.length === 0) return trimmed;

    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
}
