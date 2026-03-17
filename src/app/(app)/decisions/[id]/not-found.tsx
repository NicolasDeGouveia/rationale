import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DecisionNotFound() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-96 text-center">
      <p className="text-4xl font-bold text-neutral-200 mb-4">404</p>
      <h1 className="text-lg font-semibold text-neutral-700 mb-2">Décision introuvable</h1>
      <p className="text-sm text-neutral-500 mb-6">Cette décision a peut-être été supprimée ou vous n&apos;y avez pas accès.</p>
      <Link href="/decisions">
        <Button variant="secondary" size="sm">Retour aux décisions</Button>
      </Link>
    </div>
  );
}
