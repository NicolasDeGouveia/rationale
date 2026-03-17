export const REVIEW_DUE_SOON_DAYS = 7;

export const DECISION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  DECIDED: "Décidé",
  REOPENED: "Rouvert",
  ARCHIVED: "Archivé",
};

export const DECISION_STATUS_OPTIONS = [
  { value: "DECIDED", label: "Décidé" },
  { value: "DRAFT", label: "Brouillon" },
  { value: "REOPENED", label: "Rouvert" },
  { value: "ARCHIVED", label: "Archivé" },
] as const;

export const ACTIVITY_ACTION_LABELS: Record<string, string> = {
  CREATED: "a créé cette décision",
  UPDATED: "a modifié cette décision",
  STATUS_CHANGED: "a changé le statut",
  COMMENTED: "a ajouté un commentaire",
  REVIEW_RESCHEDULED: "a replanifié la révision",
  ARCHIVED: "a archivé cette décision",
  REOPENED: "a rouvert cette décision",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Actif", color: "text-green-700 bg-green-50 border-green-200" },
  TRIALING: { label: "Essai", color: "text-blue-700 bg-blue-50 border-blue-200" },
  PAST_DUE: { label: "Paiement en retard", color: "text-red-700 bg-red-50 border-red-200" },
  CANCELED: { label: "Annulé", color: "text-neutral-600 bg-neutral-50 border-neutral-200" },
  INCOMPLETE: { label: "Incomplet", color: "text-amber-700 bg-amber-50 border-amber-200" },
  PAUSED: { label: "En pause", color: "text-neutral-600 bg-neutral-50 border-neutral-200" },
};

export const PLANS = {
  free: {
    name: "Gratuit",
    description: "Pour les individus et les petites équipes qui débutent.",
    maxDecisions: 25,
    features: ["Jusqu'à 25 décisions", "1 espace de travail", "Recherche et filtres", "File de révision"],
  },
  pro: {
    name: "Pro",
    description: "Pour les équipes qui s'appuient sur une mémoire structurée des décisions.",
    maxDecisions: null,
    features: [
      "Décisions illimitées",
      "Membres illimités",
      "Rédaction assistée par IA",
      "Support prioritaire",
    ],
  },
} as const;

export const APP_NAME = "Rationale";
export const APP_TAGLINE = "Ne perdez plus le pourquoi derrière les décisions de votre équipe.";
