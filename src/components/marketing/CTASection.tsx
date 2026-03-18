import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-neutral-900 py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
          Commencez à construire la mémoire décisionnelle de votre équipe
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8 text-base leading-relaxed">
          Gratuit pour démarrer. Aucune carte bancaire requise. Configurez votre espace en quelques minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-white">
              Commencer gratuitement
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/10">
              Voir les tarifs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
