import AboutPlatform from "@/components/home/AboutPlatform/AboutPlatform";
import CallToAction from "@/components/home/CallToAction/CallToAction";
import Faqs from "@/components/home/Faqs/Faqs";
import FeaturedCourses from "@/components/home/FeaturedCourses/FeaturedCourses";
import Hero from "@/components/home/Hero/Hero";
import LearningTracks from "@/components/home/LearningTracks/LearningTracks";
import PlatformFeatures from "@/components/home/PlatformFeatures/PlatformFeatures";
import Process from "@/components/home/Process/Process";
import Stats from "@/components/home/Stats/Stats";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <AboutPlatform/>
                <LearningTracks />
                <FeaturedCourses />
                <PlatformFeatures/>
                <Process />
                <Stats/>
                <Faqs/>
                <CallToAction/>
            </main>

            <Footer />
        </>
    );
}