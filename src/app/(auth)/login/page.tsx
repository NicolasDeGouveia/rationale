"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? "Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Card>
      <CardBody>
        <div className="mb-6 text-center">
          <p className="text-base font-semibold text-neutral-900">{APP_NAME}</p>
          <p className="text-sm text-neutral-500 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">Sign in</Button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <Link href="/reset-password" className="text-xs text-neutral-500 hover:text-neutral-700">
            Forgot your password?
          </Link>
          <p className="text-xs text-neutral-500">
            No account?{" "}
            <Link href="/signup" className="font-medium text-neutral-900 hover:underline">Sign up</Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
