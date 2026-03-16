import { Badge } from "@/components/ui/badge";

interface ReviewUrgencyBadgeProps {
  urgency: "overdue" | "due_soon" | "missing";
  daysDelta?: number | null;
}

export function ReviewUrgencyBadge({ urgency, daysDelta }: ReviewUrgencyBadgeProps) {
  if (urgency === "overdue") {
    const label = daysDelta != null ? `${Math.abs(daysDelta)}d overdue` : "Overdue";
    return <Badge variant="overdue">{label}</Badge>;
  }
  if (urgency === "due_soon") {
    const label = daysDelta != null ? `Due in ${daysDelta}d` : "Due soon";
    return <Badge variant="due-soon">{label}</Badge>;
  }
  return <Badge variant="missing">No review date</Badge>;
}
