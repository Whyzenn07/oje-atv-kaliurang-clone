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
import FAQSection from "@/components/FAQSection";
import LocationSection from "@/components/LocationSection";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MobileStickyBar from "@/components/MobileStickyBar";
import ScrollToTop from "@/components/ScrollToTop";

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
      <FAQSection />
      <LocationSection />
      {/* Extra bottom padding on mobile agar konten tidak tertutup sticky bar */}
      <div className="pb-16 md:pb-0">
        <FooterSection />
      </div>
      <FloatingWhatsApp />
      <MobileStickyBar />
      <ScrollToTop />
    </main>
  );
}
