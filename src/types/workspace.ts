export type WorkspaceRole = "ADMIN" | "MEMBER";

export type WorkspaceContext = {
  id: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
  subscription: {
    status: string | null;
    plan: "free" | "pro";
    currentPeriodEnd: string | null;
  };
};
