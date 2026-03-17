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
            <p className="text-base font-semibold text-neutral-900">Check your inbox</p>
            <p className="text-sm text-neutral-500">
              We sent a verification link to <span className="font-medium text-neutral-700">{verifiedEmail}</span>.
              Click the link to activate your account.
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
          <p className="text-sm text-neutral-500 mt-1">Create your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            helperText="At least 8 characters"
            error={errors.password?.message}
            {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
          />
          {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">Create account</Button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-neutral-900 hover:underline">Sign in</Link>
        </p>
      </CardBody>
    </Card>
  );
}
