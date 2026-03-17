import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailSection } from "@/components/decisions/DetailSection";

export const metadata = { title: "Exemple de décision — Rationale" };

export default function SampleDecisionPage() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Sample banner */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-800">
          Ceci est un exemple de décision — il montre à quoi ressemble un enregistrement complet et bien documenté dans Rationale.
        </p>
        <Link href="/decisions/new" className="ml-auto shrink-0">
          <Button size="sm">Créer votre première décision</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="decided">Decided</Badge>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
            Reporter l&apos;intégration Salesforce au Q4 quand la capacité du support s&apos;améliore
          </h1>
          <p className="text-base text-neutral-500 mt-2">
            Nous avons choisi de reporter l&apos;intégration Salesforce au Q4 pour éviter de surcharger l&apos;équipe support pendant la saison d&apos;onboarding.
          </p>
        </div>

        {/* Key metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Responsable</p>
            <p className="text-sm font-medium text-neutral-900">Sarah Chen</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Statut</p>
            <Badge variant="decided">Décidé</Badge>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Décidé le</p>
            <p className="text-sm text-neutral-700">12 sep. 2024</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">Date de révision</p>
            <p className="text-sm text-neutral-700">1 déc. 2024</p>
          </div>
        </div>

        {/* Rationale */}
        <DetailSection title="Justification">
          <p className="text-base text-neutral-800 leading-relaxed">
            Reporter au Q4 élimine le risque d&apos;exécution pendant notre période d&apos;onboarding la plus critique. L&apos;intégration nécessite environ 3 semaines de mise en place et de coordination inter-équipes — du temps que l&apos;équipe support ne peut pas se permettre en Q3. La valeur métier de l&apos;intégration est réelle mais pas urgente : la synchronisation Salesforce améliore l&apos;efficacité des rapports, elle ne débloque pas de revenus actuels. Nous avons envisagé un prestataire, mais la coordination reste à la charge du support interne, donc le profil de risque ne change pas vraiment. Le Q4 offre une fenêtre claire avec une capacité suffisante et sans priorités concurrentes.
          </p>
        </DetailSection>

        {/* Context */}
        <DetailSection title="Contexte">
          <p className="text-sm text-neutral-700 leading-relaxed">
            L&apos;intégration Salesforce était initialement prévue en Q3 pour améliorer la qualité des données CRM et réduire les rapports manuels. Cependant, le Q3 coïncide avec notre plus grande cohorte d&apos;onboarding annuelle — 40% de nos nouveaux clients de l&apos;année s&apos;inscrivent entre août et octobre. L&apos;équipe support est déjà engagée sur les opérations d&apos;onboarding, la formation produit et une migration d&apos;infrastructure en parallèle. Ajouter un projet d&apos;intégration CRM nécessiterait leur implication pour les tests, le mapping des données et la résolution des problèmes post-lancement. L&apos;équipe technique a signalé cette dépendance lors de la revue de planification Q3.
          </p>
        </DetailSection>

        {/* Alternatives */}
        <DetailSection title="Alternatives envisagées">
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <span className="text-neutral-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-neutral-800">Procéder à l&apos;intégration en Q3 comme prévu</span>
                <p className="text-neutral-500 mt-0.5">Risque de surcharger l&apos;équipe support pendant le pic d&apos;onboarding. Rejeté — l&apos;inconvénient est trop élevé compte tenu du caractère non critique de l&apos;intégration.</p>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-neutral-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-neutral-800">Faire appel à un prestataire pour piloter le projet</span>
                <p className="text-neutral-500 mt-0.5">Réduit la charge technique mais la coordination avec le support reste entière. Coût estimé à 8 000 € pour 3 semaines. Rejeté — coût non justifié vu que l&apos;option de report existe.</p>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-neutral-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-neutral-800">Limiter à une synchronisation Salesforce en lecture seule</span>
                <p className="text-neutral-500 mt-0.5">Réduirait l&apos;effort significativement mais ne répond pas au besoin de reporting. Déprioritisé — solution partielle avec un coût de coordination complet.</p>
              </div>
            </li>
          </ul>
        </DetailSection>

        {/* Assumptions */}
        <DetailSection title="Hypothèses">
          <ul className="space-y-1">
            {[
              "La capacité de l'équipe support reviendra à la normale d'ici novembre",
              "Les exigences de l'intégration Salesforce ne changeront pas significativement d'ici le Q4",
              "Aucun engagement client ne nécessitera la synchronisation Salesforce avant le Q4",
            ].map((a) => (
              <li key={a} className="text-sm text-neutral-700 flex gap-2">
                <span className="text-neutral-300">–</span>{a}
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {["intégrations", "support", "planification-q3"].map((tag) => (
            <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 mb-3">
            Prêt à documenter vos propres décisions ? Un enregistrement complet prend moins de 2 minutes.
          </p>
          <Link href="/decisions/new">
            <Button>Créer votre première décision</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
