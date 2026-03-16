"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password/confirm`,
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm font-semibold text-neutral-900 mb-1">Check your email</p>
          <p className="text-sm text-neutral-500">
            We sent a password reset link to <strong>{email}</strong>.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="mb-6">
          <p className="text-base font-semibold text-neutral-900">Reset your password</p>
          <p className="text-sm text-neutral-500 mt-1">Enter your email and we&apos;ll send a reset link.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full">Send reset link</Button>
        </form>
      </CardBody>
    </Card>
  );
}
