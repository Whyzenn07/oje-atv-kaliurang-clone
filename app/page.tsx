import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProfilSection from "@/components/ProfilSection";
import KenapaKamiSection from "@/components/KenapaKamiSection";
import StatsSection from "@/components/StatsSection";
import PricingSection from "@/components/PricingSection";
import TentangKamiSection from "@/components/TentangKamiSection";
import TestimonialSection from "@/components/TestimonialSection";
import GallerySection from "@/components/GallerySection";
import BookingForm from "@/components/BookingForm";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ProfilSection />
      <KenapaKamiSection />
      <StatsSection />
      <PricingSection />
      <TentangKamiSection />
      <TestimonialSection />
      <GallerySection />
      <BookingForm />
      <FooterSection />
      <FloatingWhatsApp />
    </main>
  );
}
