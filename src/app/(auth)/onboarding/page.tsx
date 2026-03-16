"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createWorkspaceAction } from "@/server/actions/workspace.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("name", name);
    const result = await createWorkspaceAction(fd);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Card>
      <CardBody>
        <div className="mb-6">
          <p className="text-base font-semibold text-neutral-900">Create your workspace</p>
          <p className="text-sm text-neutral-500 mt-1">
            Your workspace is where your team&apos;s decisions live.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Workspace name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Inc."
            required
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">Create workspace</Button>
        </form>
      </CardBody>
    </Card>
  );
}
