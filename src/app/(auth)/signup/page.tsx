"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? "Could not create account");
    } else {
      setVerified(true);
    }
  }

  if (verified) {
    return (
      <Card>
        <CardBody>
          <div className="text-center space-y-2">
            <p className="text-base font-semibold text-neutral-900">Check your inbox</p>
            <p className="text-sm text-neutral-500">
              We sent a verification link to <span className="font-medium text-neutral-700">{email}</span>.
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" helperText="At least 8 characters" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">Create account</Button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-neutral-900 hover:underline">Sign in</Link>
        </p>
      </CardBody>
    </Card>
  );
}
