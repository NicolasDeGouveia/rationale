import { HeroSection } from "@/components/marketing/HeroSection";
import { BeforeAfterSection } from "@/components/marketing/BeforeAfterSection";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import { AppPreviewSection } from "@/components/marketing/AppPreviewSection";
import { CTASection } from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BeforeAfterSection />
      <WorkflowSection />
      <AppPreviewSection />
      <CTASection />
    </main>
  );
}
