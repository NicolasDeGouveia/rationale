"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createWorkspaceAction } from "@/server/actions/workspace.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import type { WorkspaceFormFields } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceFormFields>();

  async function onSubmit({ name }: WorkspaceFormFields) {
    const fd = new FormData();
    fd.set("name", name);
    const result = await createWorkspaceAction(fd);
    if (!result.success) {
      setError("root", { message: result.error });
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Workspace name"
            type="text"
            placeholder="Acme Inc."
            error={errors.name?.message}
            {...register("name", { required: "Workspace name is required" })}
          />
          {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">Create workspace</Button>
        </form>
      </CardBody>
    </Card>
  );
}
