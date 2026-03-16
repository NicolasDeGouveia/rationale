import { Badge } from "@/components/ui/badge";
import { DECISION_STATUS_LABELS } from "@/lib/constants";
import type { DecisionStatus } from "@/types";

const statusToVariant: Record<DecisionStatus, "draft" | "decided" | "reopened" | "archived"> = {
  DRAFT: "draft",
  DECIDED: "decided",
  REOPENED: "reopened",
  ARCHIVED: "archived",
};

interface StatusBadgeProps {
  status: DecisionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusToVariant[status]}>
      {DECISION_STATUS_LABELS[status]}
    </Badge>
  );
}
