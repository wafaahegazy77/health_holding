

import Link from "next/link";
import "./_Footer.scss";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";


const Footer = async () => {
    const t = await getTranslations("footer");

    return (
        <footer className="footer_section">
            <div className="container">
                <Reveal animation="fade-down" > 
                   Footer
                </Reveal>

            </div>
        </footer>
    );
};

export default Footer;