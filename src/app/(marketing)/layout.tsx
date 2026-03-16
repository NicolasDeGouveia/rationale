import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#F0F2F8" }} className="min-h-screen">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
