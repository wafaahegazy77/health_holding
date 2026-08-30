import AboutPlatform from "@/components/home/AboutPlatform/AboutPlatform";
import Hero from "@/components/home/Hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <AboutPlatform/>
            </main>

            <Footer />
        </>
    );
}