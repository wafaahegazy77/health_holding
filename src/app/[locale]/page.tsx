import AboutPlatform from "@/components/home/AboutPlatform/AboutPlatform";
import CallToAction from "@/components/home/CallToAction/CallToAction";
import CEOMessage from "@/components/home/CEOMessage/CEOMessage";
import Faqs from "@/components/home/Faqs/Faqs";
import HeadTrainingMessage from "@/components/home/HeadTrainingMessage/HeadTrainingMessage";
import Hero from "@/components/home/Hero/Hero";
import Process from "@/components/home/Process/Process";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import LenisProvider from "@/components/LenisProvider";

export default function Home() {
    return (
        <LenisProvider>
            <Navbar />

            <main>
                <Hero />
                <AboutPlatform />
                <CEOMessage />
                <HeadTrainingMessage />
                <Process />
                <Faqs />
                <CallToAction />
            </main>

            <Footer />
        </LenisProvider>
    );
}