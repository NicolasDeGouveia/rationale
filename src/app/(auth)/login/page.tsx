"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { LoginFormFields } from "@/types";

export default function LoginPage() {
  return (
    <Suspense fallback={<Card><CardBody /></Card>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "1";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>();

  async function onSubmit({ email, password }: LoginFormFields) {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      setError("root", { message: result.error.message ?? "Invalid email or password" });
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Card>
      <CardBody>
        {verified && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 text-center">
            E-mail vérifié. Connectez-vous pour continuer.
          </div>
        )}
        <div className="mb-6 text-center">
          <p className="text-base font-semibold text-neutral-900">{APP_NAME}</p>
          <p className="text-sm text-neutral-500 mt-1">Connectez-vous à votre compte</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", { required: "L'e-mail est requis" })}
          />
          <Input
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password", { required: "Le mot de passe est requis" })}
          />
          {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">Se connecter</Button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <Link href="/reset-password" className="text-xs text-neutral-500 hover:text-neutral-700">
            Mot de passe oublié ?
          </Link>
          <p className="text-xs text-neutral-500">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="font-medium text-neutral-900 hover:underline">S&apos;inscrire</Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
