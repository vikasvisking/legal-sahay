import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeatureSection } from "@/components/home/FeatureSection";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <ServicesGrid />
            <FeatureSection />
            <Testimonials />
        </div>
    );
}
