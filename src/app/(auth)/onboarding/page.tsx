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
          <p className="text-base font-semibold text-neutral-900">Créez votre espace de travail</p>
          <p className="text-sm text-neutral-500 mt-1">
            Votre espace de travail est l&apos;endroit où vivent les décisions de votre équipe.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom de l'espace de travail"
            type="text"
            placeholder="Acme Inc."
            error={errors.name?.message}
            {...register("name", { required: "Le nom de l'espace de travail est requis" })}
          />
          {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">Créer l&apos;espace de travail</Button>
        </form>
      </CardBody>
    </Card>
  );
}
