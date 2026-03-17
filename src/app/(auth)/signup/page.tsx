"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { SignupFormFields } from "@/types";

export default function SignupPage() {
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormFields>();

  async function onSubmit({ name, email, password }: SignupFormFields) {
    const result = await authClient.signUp.email({ name, email, password });
    if (result.error) {
      setError("root", { message: result.error.message ?? "Could not create account" });
      return;
    }
    await authClient.sendVerificationEmail({ email, callbackURL: "/login?verified=1" });
    setVerifiedEmail(email);
  }

  if (verifiedEmail) {
    return (
      <Card>
        <CardBody>
          <div className="text-center space-y-2">
            <p className="text-base font-semibold text-neutral-900">Vérifiez votre boîte mail</p>
            <p className="text-sm text-neutral-500">
              Nous avons envoyé un lien de vérification à <span className="font-medium text-neutral-700">{verifiedEmail}</span>.
              Cliquez sur le lien pour activer votre compte.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="mb-6 text-center">
          <p className="text-base font-semibold text-neutral-900">{APP_NAME}</p>
          <p className="text-sm text-neutral-500 mt-1">Créez votre compte</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", { required: "Le nom est requis" })}
          />
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
            autoComplete="new-password"
            helperText="Au moins 8 caractères"
            error={errors.password?.message}
            {...register("password", { required: "Le mot de passe est requis", minLength: { value: 8, message: "Au moins 8 caractères" } })}
          />
          {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">Créer un compte</Button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-neutral-900 hover:underline">Se connecter</Link>
        </p>
      </CardBody>
    </Card>
  );
}
