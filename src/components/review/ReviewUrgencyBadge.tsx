import { Badge } from "@/components/ui/badge";

interface ReviewUrgencyBadgeProps {
  urgency: "overdue" | "due_soon" | "missing";
  daysDelta?: number | null;
}

export function ReviewUrgencyBadge({ urgency, daysDelta }: ReviewUrgencyBadgeProps) {
  if (urgency === "overdue") {
    const label = daysDelta != null ? `${Math.abs(daysDelta)}j de retard` : "En retard";
    return <Badge variant="overdue">{label}</Badge>;
  }
  if (urgency === "due_soon") {
    const label = daysDelta != null ? `Dans ${daysDelta}j` : "Bientôt";
    return <Badge variant="due-soon">{label}</Badge>;
  }
  return <Badge variant="missing">Pas de date de révision</Badge>;
}
