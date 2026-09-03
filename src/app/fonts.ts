import { Cairo, Poppins, Prata } from "next/font/google";

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    variable: "--font-poppins",
    display: "swap",
});

export const prata = Prata({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-prata",
    display: "swap",
});

export const cairo = Cairo({
    subsets: ["arabic", "latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-cairo",
    display: "swap",
});
