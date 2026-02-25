import { HeroSection } from "../components/HeroSection";
import { FreeResourcesSection } from "../components/FreeResourcesSection";
import { AIToolsSection } from "../components/AIToolsSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { DashboardPreview } from "../components/DashboardPreview";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { FeatureHighlights } from "../components/FeatureHighlights";
import { StudentTestimonials } from "../components/StudentTestimonials";
import { FAQ } from "../components/FAQ";
import { PartnerLogos } from "../components/PartnerLogos";
import StudentMapSection from "../components/home/StudentMapSection";
import { EventsPreviewSection } from "../components/home/EventsPreviewSection";

export default function Home() {
  return (
    <main>
      <section id="home">
        <HeroSection />
      </section>
      <section id="events">
        <EventsPreviewSection />
      </section>
      <section id="benefits">
        <BenefitsSection />
      </section>
      <section id="ai-tools">
        <AIToolsSection />
      </section>
      <section id="dashboard">
        <DashboardPreview />
      </section>
      <FreeResourcesSection />
      <StudentMapSection />
      <NewsletterSignup />
      <FeatureHighlights />
      <StudentTestimonials />
      <FAQ />
      <section id="contact">
        <PartnerLogos />
      </section>
    </main>
  );
}
