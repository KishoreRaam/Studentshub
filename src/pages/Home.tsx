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

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FreeResourcesSection />
      <AIToolsSection />
      <BenefitsSection />
      <DashboardPreview />
      <NewsletterSignup />
      <FeatureHighlights />
      <StudentTestimonials />
      <FAQ />
      <PartnerLogos />
    </main>
  );
}
