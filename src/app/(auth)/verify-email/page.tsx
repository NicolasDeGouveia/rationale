"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardBody } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    authClient.verifyEmail({ query: { token } }).then((result) => {
      if (result.error) {
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => router.push("/onboarding"), 2000);
      }
    });
  }, [searchParams, router]);

  return (
    <div className="text-center space-y-2">
      {status === "loading" && (
        <>
          <Spinner className="mx-auto w-5 h-5 mb-3" />
          <p className="text-sm text-neutral-500">Verifying your email…</p>
        </>
      )}
      {status === "success" && (
        <>
          <p className="text-base font-semibold text-neutral-900">Email verified</p>
          <p className="text-sm text-neutral-500">Redirecting you to setup your workspace…</p>
        </>
      )}
      {status === "error" && (
        <>
          <p className="text-base font-semibold text-neutral-900">Verification failed</p>
          <p className="text-sm text-neutral-500">
            This link is invalid or has expired.{" "}
            <a href="/signup" className="font-medium text-neutral-900 hover:underline">
              Sign up again
            </a>
          </p>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardBody>
        <Suspense fallback={
          <div className="text-center">
            <Spinner className="mx-auto w-5 h-5" />
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </CardBody>
    </Card>
  );
}
