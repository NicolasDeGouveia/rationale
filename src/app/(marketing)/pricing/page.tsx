import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PLANS } from "@/lib/constants";

export const metadata = { title: "Tarifs — Rationale" };

export default function PricingPage() {
  return (
    <main className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-3">Tarifs simples</h1>
          <p className="text-neutral-500">Gratuit pour démarrer. Passez au Pro quand votre équipe grandit.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <Card>
            <CardBody>
              <p className="text-sm font-semibold text-neutral-900 mb-1">{PLANS.free.name}</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1">$0</p>
              <p className="text-sm text-neutral-500 mb-6">{PLANS.free.description}</p>
              <ul className="space-y-2 mb-8">
                {PLANS.free.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                    <span className="text-neutral-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block">
                <Button variant="secondary" className="w-full">Commencer gratuitement</Button>
              </Link>
            </CardBody>
          </Card>
          {/* Pro */}
          <Card className="border-neutral-900 ring-1 ring-neutral-900">
            <CardBody>
              <p className="text-sm font-semibold text-neutral-900 mb-1">{PLANS.pro.name}</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1">$29<span className="text-base font-normal text-neutral-500">/mo</span></p>
              <p className="text-sm text-neutral-500 mb-6">{PLANS.pro.description}</p>
              <ul className="space-y-2 mb-8">
                {PLANS.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                    <span className="text-neutral-900">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block">
                <Button className="w-full">Démarrer l&apos;essai gratuit</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
